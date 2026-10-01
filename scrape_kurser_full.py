import json
import re
import requests
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor

# Full list of courses to scrape via kurser.dtu.dk for type_of_assessment + exam_duration
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

s = requests.Session()
s.headers.update({'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})

# Warm up session
s.get('https://kurser.dtu.dk/course/02289?forceLogin=true', timeout=12)

def fetch_kurser_detail(code):
    url = f"https://kurser.dtu.dk/course/{code}"
    try:
        res = s.get(url, timeout=15)
        if 'loginFrame' in res.text:
            s.get(f"{url}?forceLogin=true", timeout=10)
            res = s.get(url, timeout=15)
        
        text = res.text
        soup = BeautifulSoup(text, 'html.parser')
        
        info = {'code': code, 'schedule': '', 'slot': '', 'type_of_assessment': '', 'exam_duration': '', 'semesters': []}
        
        full_text = soup.get_text()
        
        # Schedule
        sched_m = re.search(r'Schedule\s+([^\n\r]+)', full_text)
        if sched_m:
            sched = sched_m.group(1).strip().split('Location')[0].strip().split('Scope')[0].strip()
            info['schedule'] = sched
        
        # Type of assessment
        assess_m = re.search(r'Type of assessment\s+([^\n\r]+)', full_text)
        if assess_m:
            assess = assess_m.group(1).strip().split('Exam duration')[0].strip().split('Aid')[0].strip().split('Evaluation')[0].strip()
            info['type_of_assessment'] = assess
        
        # Exam duration
        dur_m = re.search(r'Exam duration\s+([^\n\r]+)', full_text)
        if dur_m:
            dur = dur_m.group(1).strip().split('Aid')[0].strip().split('Evaluation')[0].strip()
            info['exam_duration'] = dur

        # ECTS
        ects_m = re.search(r'Point\(\s*ECTS\s*\)\s*([0-9.]+)', full_text)
        if ects_m:
            info['ects'] = ects_m.group(1).strip()

        # Parse slot from schedule
        sched = info['schedule']
        slots = re.findall(r'\b([EF][1-9][AB]?)\b', sched)
        if slots:
            unique_slots = list(dict.fromkeys(slots))
            # Only keep first 2 if dual-semester
            info['slot'] = '/'.join(unique_slots[:2])
        elif 'January' in sched or 'january' in sched:
            info['slot'] = 'Jan'
        elif 'June' in sched or 'june' in sched:
            info['slot'] = 'Jun'
        elif 'August' in sched or 'august' in sched:
            info['slot'] = 'Aug'
        elif 'E7' in sched:
            info['slot'] = 'E7'
            
        # Semesters
        slots_in_schedule = re.findall(r'\b([EF][1-9][AB]?|E7)\b', sched)
        for sl in slots_in_schedule:
            if sl.startswith('E'):
                if 'Autumn' not in info['semesters']:
                    info['semesters'].append('Autumn')
            elif sl.startswith('F'):
                if 'Spring' not in info['semesters']:
                    info['semesters'].append('Spring')
        if 'January' in sched:
            info['semesters'].append('January')
        if 'June' in sched:
            info['semesters'].append('June')
        if 'August' in sched:
            info['semesters'].append('August')
        
        # Build clean exam
        t = info['type_of_assessment'].lower()
        dur = info['exam_duration']
        dur_hrs_m = re.search(r'(\d+)\s*hour', dur, re.I)
        hrs = f"{dur_hrs_m.group(1)}h" if dur_hrs_m else ""
        
        # Build clean label
        if 'oral' in t and 'written' in t:
            exam_clean = f"Oral + written {hrs}".strip() if hrs else "Oral + written"
        elif 'oral' in t and 'report' in t:
            exam_clean = "Oral + report"
        elif 'oral' in t and 'project' in t:
            exam_clean = "Oral + project"
        elif 'written' in t and 'report' in t:
            exam_clean = f"Written {hrs} + report".strip() if hrs else "Written + report"
        elif 'written' in t and 'project' in t:
            exam_clean = f"Written {hrs} + project".strip() if hrs else "Written + project"
        elif 'oral' in t:
            exam_clean = "Oral"
        elif 'written' in t:
            exam_clean = f"Written {hrs}".strip() if hrs else "Written"
        elif 'report' in t:
            exam_clean = "Report"
        elif 'project' in t:
            exam_clean = "Project"
        elif 'evaluation' in t:
            exam_clean = "Evaluation"
        elif 'assignment' in t or 'hand' in t:
            exam_clean = "Report"
        else:
            exam_clean = info['type_of_assessment'] if info['type_of_assessment'] else ""
        
        info['exam_clean'] = exam_clean
        return info
    except Exception as e:
        return {'code': code, 'error': str(e), 'slot': '', 'exam_clean': ''}

print("Fetching detailed exam/slot info from kurser.dtu.dk...")
results = {}
with ThreadPoolExecutor(max_workers=8) as ex:
    for res in ex.map(fetch_kurser_detail, COURSE_CODES):
        results[res['code']] = res
        if 'error' not in res:
            print(f"[{res['code']}] Slot={res['slot']} | Exam={res['exam_clean']} | Schedule={res['schedule']}")
        else:
            print(f"[{res['code']}] ERROR: {res['error']}")

with open("scraped_kurser_detail.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("\nDone! Results saved to scraped_kurser_detail.json")
