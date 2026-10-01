import requests
from bs4 import BeautifulSoup
import re
import json
import time

COURSE_CODES = [
  "02180", "02201", "02203", "02205", "02207", "02209", "02211", "02214",
  "02225", "02226", "02231", "02232", "02234", "02242", "02244", "02245",
  "02246", "02247", "02249", "02256", "02258", "02262", "02266", "02267",
  "02268", "02269", "02270", "02271", "02275", "02276", "02277", "02278",
  "02280", "02282", "02287", "02289", "02291", "02409", "02417", "02443",
  "02452", "02455", "02456", "02458", "02460", "02471", "02476", "02477",
  "02501", "02504", "02506", "02510", "02516", "02517", "02518", "02561",
  "02562", "02563", "02566", "02581", "02582", "02611", "02612", "02613",
  "02614", "02619", "02805", "02806", "02807", "02808", "02810", "02830",
  "02840", "02841", "12100", "12101", "12105", "12106", "30554", "34241",
  "34366", "34367", "34745", "34746", "34752", "34753", "34755", "34757",
  "34759", "34760", "34761", "34763", "34764", "34766", "38102", "38103",
  "38106", "38110", "38113", "38400", "38401", "38402", "38403", "38404",
  "38405", "42136", "42137", "42186"
]

def make_exam_clean(type_of_assessment, exam_duration):
    t = (type_of_assessment or "").lower()
    dur = exam_duration or ""
    
    dur_hrs_m = re.search(r'(\d+)\s*hour', dur, re.I)
    hrs = f"{dur_hrs_m.group(1)}h" if dur_hrs_m else ""
    
    if 'oral' in t and 'written' in t:
        return f"Oral + written {hrs}".strip() if hrs else "Oral + written"
    elif 'oral' in t and 'report' in t:
        return "Oral + report"
    elif 'oral' in t and 'project' in t:
        return "Oral + project"
    elif 'written' in t and ('report' in t or 'assignment' in t):
        return f"Written {hrs} + report".strip() if hrs else "Written + report"
    elif 'written' in t and 'project' in t:
        return f"Written {hrs} + project".strip() if hrs else "Written + project"
    elif 'oral' in t:
        return "Oral"
    elif 'written' in t:
        return f"Written {hrs}".strip() if hrs else "Written"
    elif 'report' in t or 'hand-in' in t or 'hand in' in t:
        return "Report"
    elif 'project' in t:
        return "Project"
    elif 'evaluation' in t:
        return "Evaluation"
    elif t:
        return t.capitalize()
    return ""

results = {}

for code in COURSE_CODES:
    url = f"https://kurser.dtu.dk/course/{code}"
    info = {
        'code': code,
        'schedule': '',
        'slot': '',
        'type_of_assessment': '',
        'exam_duration': '',
        'exam_clean': '',
        'semesters': []
    }
    
    try:
        # Fresh session per course to avoid threading issues
        s = requests.Session()
        s.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Language': 'en-US,en;q=0.9',
        })
        
        # Trigger session/auth cookie
        s.get(f"{url}?forceLogin=true", timeout=12)
        time.sleep(0.3)
        res = s.get(url, timeout=12)
        
        if res.status_code != 200 or len(res.text) < 1000:
            print(f"[{code}] Skip - short/error response ({len(res.text)} bytes)")
            results[code] = info
            continue
        
        soup = BeautifulSoup(res.text, 'html.parser')
        full_text = soup.get_text(separator='\n')
        
        # Schedule (look for "Schedule\nAutumn E5A..." pattern)
        sched_m = re.search(r'Schedule\s*\n\s*([^\n]+)', full_text)
        if sched_m:
            sched = sched_m.group(1).strip()
            info['schedule'] = sched
        
        # Type of assessment
        assess_m = re.search(r'Type of assessment\s*\n\s*([^\n]+)', full_text)
        if assess_m:
            info['type_of_assessment'] = assess_m.group(1).strip()
        
        # Exam duration
        dur_m = re.search(r'Exam duration\s*\n\s*([^\n]+)', full_text)
        if dur_m:
            info['exam_duration'] = dur_m.group(1).strip()
        
        # Parse slot
        sched = info['schedule']
        # Look for E/F slot codes like E5A, F4B, E7, F3A, E2B, etc.
        slots = re.findall(r'\b([EF][1-9][AB]?|E7)\b', sched)
        if slots:
            unique_slots = list(dict.fromkeys(slots))
            info['slot'] = '/'.join(unique_slots)
        elif 'January' in sched:
            info['slot'] = 'Jan'
            info['semesters'].append('January')
        elif 'June' in sched:
            info['slot'] = 'Jun'
            info['semesters'].append('June')
        elif 'August' in sched:
            info['slot'] = 'Aug'
            info['semesters'].append('August')
        elif 'Special' in sched or 'DADIU' in sched:
            info['slot'] = 'Autumn'
        
        for sl in slots:
            if sl.startswith('E') and 'Autumn' not in info['semesters']:
                info['semesters'].append('Autumn')
            elif sl.startswith('F') and 'Spring' not in info['semesters']:
                info['semesters'].append('Spring')
        
        info['exam_clean'] = make_exam_clean(info['type_of_assessment'], info['exam_duration'])
        
        print(f"[{code}] Slot={info['slot']} | Assessment={info['type_of_assessment']} | Duration={info['exam_duration']} -> {info['exam_clean']}")
        
    except Exception as e:
        print(f"[{code}] ERROR: {e}")
    
    results[code] = info

with open("kurser_detail_seq.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("\nDone. Saved to kurser_detail_seq.json")
