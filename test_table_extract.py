import requests
from bs4 import BeautifulSoup
import re
import json

s = requests.Session()
s.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
})

def fetch_course_info(code):
    url = f'https://kurser.dtu.dk/course/{code}'
    try:
        res = s.get(url, timeout=12)
        if 'loginFrame' in res.text:
            m = re.search(r'src="(\?forceLogin=true[^"]*)"', res.text)
            if m:
                s.get(f'https://kurser.dtu.dk/course/{code}{m.group(1)}')
                res = s.get(url, timeout=12)

        soup = BeautifulSoup(res.text, 'html.parser')
        
        # Course title
        h1 = soup.find(['h1', 'h2'])
        raw_title = h1.text.strip() if h1 else ""
        title = re.sub(r'^\d{5}\s*', '', raw_title).strip()
        
        fields = {}
        for tr in soup.find_all('tr'):
            tds = tr.find_all(['td', 'th'])
            if len(tds) >= 2:
                label = tds[0].get_text(' ', strip=True)
                val = tds[1].get_text(' ', strip=True)
                fields[label] = val
                
        schedule = fields.get('Schedule', '')
        type_of_assessment = fields.get('Type of assessment', '')
        exam_duration = fields.get('Exam duration', '')
        date_of_exam = fields.get('Date of examination', '')
        ects = fields.get('Point( ECTS )', '')
        
        # Slot parsing from Schedule
        slots = re.findall(r'\b([EF][1-7][AB]?)\b', schedule)
        slot = ""
        if slots:
            slot = '/'.join(dict.fromkeys(slots))
        elif 'January' in schedule:
            slot = 'Jan'
        elif 'June' in schedule:
            slot = 'Jun'
        elif 'August' in schedule:
            slot = 'Aug'
        elif 'Special schedule' in schedule or 'DADIU' in title:
            slot = 'Autumn'

        # Exam clean formatting
        # Duration hours
        dur_hrs = re.search(r'(\d+)\s*hour', exam_duration, re.I)
        hrs = f"{dur_hrs.group(1)}h" if dur_hrs else ""
        
        t_lower = type_of_assessment.lower()
        exam_clean = ""
        if "oral" in t_lower and "written" in t_lower:
            exam_clean = f"Written {hrs} + oral" if hrs else "Written + oral"
        elif "written" in t_lower and ("report" in t_lower or "assignment" in t_lower or "project" in t_lower):
            exam_clean = f"Written {hrs} + report" if hrs else "Written + report"
        elif "oral" in t_lower and ("report" in t_lower or "assignment" in t_lower or "project" in t_lower):
            exam_clean = "Oral + report"
        elif "oral" in t_lower:
            exam_clean = "Oral"
        elif "written" in t_lower:
            exam_clean = f"Written {hrs}" if hrs else "Written"
        elif "report" in t_lower or "assignment" in t_lower:
            exam_clean = "Report"
        elif "project" in t_lower:
            exam_clean = "Project"
        elif "evaluation" in t_lower:
            exam_clean = "Report"
        else:
            exam_clean = type_of_assessment or "Unknown"

        return {
            'code': code,
            'title': title,
            'slot': slot,
            'schedule': schedule,
            'type_of_assessment': type_of_assessment,
            'exam_duration': exam_duration,
            'exam_clean': exam_clean,
            'date_of_exam': date_of_exam,
            'ects': ects
        }
    except Exception as e:
        return {'code': code, 'error': str(e)}

test_codes = ['02180', '02201', '02231', '02258', '02289', '02417', '02452', '02456', '02517', '02807', '12105', '38113']
for code in test_codes:
    res = fetch_course_info(code)
    print(f"{res['code']}: slot='{res.get('slot')}' | exam='{res.get('exam_clean')}' | assess='{res.get('type_of_assessment')}' | dur='{res.get('exam_duration')}' | sched='{res.get('schedule')}'")
