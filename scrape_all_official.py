import requests
from bs4 import BeautifulSoup
import re
import json
import time

# Read all course codes from frontend/src/courses.js
with open('frontend/src/courses.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Match 5-digit course codes in catalog
catalog_codes = sorted(list(set(re.findall(r'["\'](\d{5})["\']:\s*\{', text))))
print(f"Found {len(catalog_codes)} course codes in catalog.")

s = requests.Session()
s.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
})

# Warm up kurser session
warm_url = 'https://kurser.dtu.dk/course/02258'
try:
    r = s.get(warm_url, timeout=12)
    if 'loginFrame' in r.text:
        m = re.search(r'src="(\?forceLogin=true[^"]*)"', r.text)
        if m:
            s.get(f'https://kurser.dtu.dk/course/02258{m.group(1)}')
            s.get(warm_url, timeout=12)
    print("Kurser session warmed up.")
except Exception as e:
    print(f"Warm up warning: {e}")

# Load dtucourseanalyzer data as fallback
analyzer_data = {}
try:
    with open('scraped_courses.json', 'r', encoding='utf-8') as f:
        analyzer_data = json.load(f)
except Exception as e:
    print(f"Could not load scraped_courses.json: {e}")

def clean_exam_string(type_of_assessment, exam_duration):
    dur_hrs = re.search(r'(\d+)\s*hour', exam_duration, re.I)
    hrs = f"{dur_hrs.group(1)}h" if dur_hrs else ""
    
    # Split primary line
    lines = [line.strip() for line in type_of_assessment.splitlines() if line.strip()]
    first_line = lines[0] if lines else ""
    # Remove trailing period or extra explanation
    first_phrase = re.split(r'\.|\sand\s(?=the\b|approval\b|to\b)', first_line, flags=re.I)[0].strip()
    p_lower = first_phrase.lower()

    if "written" in p_lower and ("oral" in p_lower):
        return f"Written {hrs} + oral" if hrs else "Written + oral"
    elif "written" in p_lower and ("report" in p_lower or "exercise" in p_lower or "assignment" in p_lower):
        return f"Written {hrs} + report" if hrs else "Written + report"
    elif "written" in p_lower and "project" in p_lower:
        return f"Written {hrs} + project" if hrs else "Written + project"
    elif "written" in p_lower:
        return f"Written {hrs}" if hrs else "Written"
    elif "oral" in p_lower and ("report" in p_lower or "exercise" in p_lower or "project" in p_lower or "assignment" in p_lower):
        return "Oral + report"
    elif "oral" in p_lower:
        return "Oral"
    elif "report" in p_lower or "exercise" in p_lower or "assignment" in p_lower or "hand-in" in p_lower:
        return "Report"
    elif "project" in p_lower:
        return "Project"
    elif "continuous" in p_lower:
        return "Continuous"
    elif "evaluation" in p_lower:
        return "Report"
    elif type_of_assessment:
        return first_phrase[:30]
    return "See course site"

results = {}

for idx, code in enumerate(catalog_codes, 1):
    info = {
        'code': code,
        'title': '',
        'slot': '',
        'schedule': '',
        'type_of_assessment': '',
        'exam_duration': '',
        'exam': '',
        'ects': '',
        'semesters': [],
        'source': 'kurser.dtu.dk'
    }
    
    url = f'https://kurser.dtu.dk/course/{code}'
    success = False
    
    try:
        res = s.get(url, timeout=12)
        if 'loginFrame' in res.text:
            m = re.search(r'src="(\?forceLogin=true[^"]*)"', res.text)
            if m:
                s.get(f'https://kurser.dtu.dk/course/{code}{m.group(1)}')
                res = s.get(url, timeout=12)

        if res.status_code == 200 and len(res.text) > 1000:
            soup = BeautifulSoup(res.text, 'html.parser')
            h1 = soup.find(['h1', 'h2'])
            raw_title = h1.text.strip() if h1 else ""
            title = re.sub(r'^\d{5}\s*', '', raw_title).strip()
            
            if title:
                info['title'] = title
                fields = {}
                for tr in soup.find_all('tr'):
                    tds = tr.find_all(['td', 'th'])
                    if len(tds) >= 2:
                        label = tds[0].get_text(' ', strip=True)
                        val = tds[1].get_text(' ', strip=True)
                        fields[label] = val
                
                info['schedule'] = fields.get('Schedule', '')
                info['type_of_assessment'] = fields.get('Type of assessment', '')
                info['exam_duration'] = fields.get('Exam duration', '')
                info['ects'] = fields.get('Point( ECTS )', '')
                
                sched = info['schedule']
                slots = re.findall(r'\b([EF][1-7][AB]?)\b', sched)
                if slots:
                    info['slot'] = '/'.join(dict.fromkeys(slots))
                elif 'January' in sched:
                    info['slot'] = 'Jan'
                elif 'June' in sched:
                    info['slot'] = 'Jun'
                elif 'August' in sched:
                    info['slot'] = 'Aug'
                elif 'Special schedule' in sched or 'DADIU' in title:
                    info['slot'] = 'Autumn'
                
                # Semesters
                if 'Autumn' in sched or any(sl.startswith('E') for sl in slots):
                    info['semesters'].append('Autumn')
                if 'Spring' in sched or any(sl.startswith('F') for sl in slots):
                    info['semesters'].append('Spring')
                if 'January' in sched or info['slot'] == 'Jan':
                    info['semesters'].append('January')
                if 'June' in sched or info['slot'] == 'Jun':
                    info['semesters'].append('June')
                if 'August' in sched or info['slot'] == 'Aug':
                    info['semesters'].append('August')
                
                info['exam'] = clean_exam_string(info['type_of_assessment'], info['exam_duration'])
                success = True
    except Exception as e:
        print(f"[{code}] Request error: {e}")

    # Fallback to dtucourseanalyzer data if kurser failed or missing slot
    if not success or not info['slot']:
        if code in analyzer_data:
            fb = analyzer_data[code]
            info['source'] = 'dtucourseanalyzer'
            if not info['title'] and fb.get('name'):
                info['title'] = fb.get('name')
            if not info['slot'] and fb.get('slot'):
                info['slot'] = fb.get('slot')
            if not info['semesters'] and fb.get('semesters'):
                info['semesters'] = fb.get('semesters')
            if not info['exam'] or info['exam'] == 'See course site':
                ex_raw = fb.get('exam', '')
                if ex_raw == 'Written exam':
                    info['exam'] = 'Written'
                elif ex_raw == 'Oral exam':
                    info['exam'] = 'Oral'
                elif ex_raw == 'Report hand-in':
                    info['exam'] = 'Report'
                else:
                    info['exam'] = ex_raw or 'Report'
            print(f"[{code}] Used fallback: slot={info['slot']}, exam={info['exam']}")
        else:
            print(f"[{code}] No data from either source!")

    print(f"({idx}/{len(catalog_codes)}) [{code}] Slot: {info['slot']} | Exam: {info['exam']} | Title: {info['title'][:35]}")
    results[code] = info
    time.sleep(0.1)

with open('official_courses_verified.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("\nDone! Saved all to official_courses_verified.json")
