import requests
from bs4 import BeautifulSoup
import re
import json

s = requests.Session()
s.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
})

def parse_kurser_page(code):
    url = f"https://kurser.dtu.dk/course/{code}"
    try:
        res = s.get(url, timeout=12)
        if 'loginFrame' in res.text:
            m = re.search(r'src="(\?forceLogin=true[^"]*)"', res.text)
            if m:
                s.get(f"https://kurser.dtu.dk/course/{code}{m.group(1)}")
                res = s.get(url, timeout=12)
        
        soup = BeautifulSoup(res.text, 'html.parser')
        
        # Course title
        h1 = soup.find(['h1', 'h2'])
        raw_title = h1.text.strip() if h1 else ""
        # Clean title
        title = re.sub(r'^\d{5}\s*', '', raw_title).strip()
        
        # We look for table or label text
        text_content = soup.get_text()
        
        info = {
            'code': code,
            'title': title,
            'raw_title': raw_title,
            'schedule': '',
            'slot': '',
            'type_of_assessment': '',
            'exam_duration': '',
            'exam_clean': '',
            'ects': '',
            'semesters': []
        }
        
        # Find in table rows or div labels
        # Let's search all tr or dd/dt or text regexes
        
        # Schedule regex:
        # e.g. Schedule Autumn E5A (Wed 8-12) or Schedule Spring F1B (Thurs 13-17) or 3-week period January
        sched_m = re.search(r'Schedule\s*([^\r\n]+)', text_content)
        if sched_m:
            sched_str = sched_m.group(1).strip()
            # remove location if attached
            sched_str = re.split(r'Location|Scope|Campus|Duration', sched_str)[0].strip()
            info['schedule'] = sched_str
            
        # Type of assessment:
        assess_m = re.search(r'Type of assessment\s*([^\r\n]+)', text_content)
        if assess_m:
            assess_str = assess_m.group(1).strip()
            assess_str = re.split(r'Exam duration|Aid|Evaluation|Date of examination', assess_str)[0].strip()
            info['type_of_assessment'] = assess_str
            
        # Exam duration:
        dur_m = re.search(r'Exam duration\s*([^\r\n]+)', text_content)
        if dur_m:
            dur_str = dur_m.group(1).strip()
            dur_str = re.split(r'Aid|Evaluation|Not applicable', dur_str)[0].strip()
            info['exam_duration'] = dur_str
            
        # ECTS:
        ects_m = re.search(r'Point\(\s*ECTS\s*\)\s*([0-9.]+)', text_content)
        if ects_m:
            info['ects'] = ects_m.group(1).strip()
            
        # Extract slot
        # e.g. "Autumn E5A (Wed 8-12)" -> slot "E5A"
        # e.g. "Spring F4A (Tues 13-17)" -> slot "F4A"
        # e.g. "3-week period January" -> "Jan"
        # e.g. "3-week period June" -> "Jun"
        # e.g. "3-week period August" -> "Aug"
        # e.g. "Autumn E1A (Mon 8-12) and Spring F1A (Mon 8-12)" -> "E1A/F1A"
        # e.g. "Autumn E7 (Tues 18-22)" -> "E7"
        sched = info['schedule']
        slots = re.findall(r'\b([EF][1-5][AB]|[EF][1-7])\b', sched)
        if slots:
            info['slot'] = '/'.join(dict.fromkeys(slots)) # preserve unique
        elif 'January' in sched:
            info['slot'] = 'Jan'
        elif 'June' in sched:
            info['slot'] = 'Jun'
        elif 'August' in sched:
            info['slot'] = 'Aug'
        elif 'Special schedule' in sched or 'DADIU' in title:
            info['slot'] = 'Autumn'
            
        # Semesters
        if 'Autumn' in sched or any(s.startswith('E') for s in slots):
            info['semesters'].append('Autumn')
        if 'Spring' in sched or any(s.startswith('F') for s in slots):
            info['semesters'].append('Spring')
        if 'January' in sched or info['slot'] == 'Jan':
            info['semesters'].append('January')
        if 'June' in sched or info['slot'] == 'Jun':
            info['semesters'].append('June')
        if 'August' in sched or info['slot'] == 'Aug':
            info['semesters'].append('August')
            
        # Build clean exam label
        # Combinations: Written exam: 4 hours -> "Written 4h"
        # Oral examination: 20 minutes -> "Oral" or "Oral 20m"
        # Report -> "Report"
        # Written examination and reports -> "Written + report"
        t_assess = info['type_of_assessment']
        dur = info['exam_duration']
        
        exam_clean = ""
        dur_hrs = re.search(r'(\d+)\s*hour', dur, re.I)
        hrs = f"{dur_hrs.group(1)}h" if dur_hrs else ""
        
        if "oral" in t_assess.lower() and "written" in t_assess.lower():
            exam_clean = f"Written {hrs} + oral" if hrs else "Written + oral"
        elif "oral" in t_assess.lower() and "report" in t_assess.lower():
            exam_clean = "Oral + report"
        elif "written" in t_assess.lower() and "report" in t_assess.lower():
            exam_clean = f"Written {hrs} + report" if hrs else "Written + report"
        elif "oral" in t_assess.lower() and "project" in t_assess.lower():
            exam_clean = "Oral + project"
        elif "written" in t_assess.lower() and "project" in t_assess.lower():
            exam_clean = f"Written {hrs} + project" if hrs else "Written + project"
        elif "oral" in t_assess.lower():
            exam_clean = "Oral"
        elif "written" in t_assess.lower():
            exam_clean = f"Written {hrs}" if hrs else "Written"
        elif "report" in t_assess.lower() or "assignment" in t_assess.lower():
            exam_clean = "Report"
        elif "project" in t_assess.lower():
            exam_clean = "Project"
        elif "evaluation" in t_assess.lower():
            exam_clean = "Evaluation"
        else:
            exam_clean = t_assess if t_assess else "See course site"
            
        info['exam_clean'] = exam_clean
        return info
    except Exception as e:
        return {'code': code, 'error': str(e)}

print(parse_kurser_page('02289'))
print(parse_kurser_page('02258'))
print(parse_kurser_page('02456'))
print(parse_kurser_page('02807'))
print(parse_kurser_page('02517'))
