import urllib.request
import re
import json
import time
from concurrent.futures import ThreadPoolExecutor
from bs4 import BeautifulSoup

# All courses in the system
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

def fetch_course(code):
    url = f"https://dtucourseanalyzer.pythonanywhere.com/course/{code}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            html = response.read().decode("utf-8")
            soup = BeautifulSoup(html, "html.parser")
            
            # Title
            h5 = soup.find("h5")
            full_title = h5.text.strip() if h5 else ""
            name = full_title.replace(code, "").strip() if full_title else ""
            
            # Extract basic info table
            sched = ""
            ects = ""
            exam = ""
            handins = ""
            
            for th in soup.find_all("th"):
                text = th.text.strip()
                td = th.find_next_sibling("td")
                val = td.text.strip() if td else ""
                
                if "Schedule:" in text:
                    sched = val
                elif "ECTS-points:" in text:
                    ects = val
                elif "Exam type:" in text:
                    exam = val
                elif "Hand-ins:" in text:
                    handins = val
            
            # Parse slot & semester from sched
            # Example sched: "E4B (Autumn, Fri 8-12)" or "F1A (Spring, Mon 8-12)" or "January (3 weeks)" or "June (3 weeks)"
            slot = ""
            semesters = []
            if sched:
                # Extract first word / code before parenthesis or full slot
                m = re.match(r"^([A-Z0-9/]+)", sched)
                if m:
                    slot = m.group(1)
                
                if "Autumn" in sched or "E" in slot and any(c.isdigit() for c in slot):
                    semesters.append("Autumn")
                if "Spring" in sched or "F" in slot and any(c.isdigit() for c in slot):
                    semesters.append("Spring")
                if "Jan" in sched or "January" in sched:
                    semesters.append("January")
                    slot = "Jan"
                if "June" in sched or "Jun" in sched:
                    semesters.append("June")
                    slot = "Jun"
                if "Aug" in sched or "August" in sched:
                    semesters.append("August")
                    slot = "Aug"
            
            return {
                "code": code,
                "name": name,
                "ects": ects,
                "schedule_raw": sched,
                "slot": slot,
                "exam": exam,
                "handins": handins,
                "semesters": semesters,
                "success": True
            }
    except Exception as e:
        return {"code": code, "error": str(e), "success": False}

print(f"Fetching {len(COURSE_CODES)} courses in parallel...")
results = {}
with ThreadPoolExecutor(max_workers=10) as executor:
    for res in executor.map(fetch_course, COURSE_CODES):
        results[res["code"]] = res
        print(f"[{res['code']}] -> Slot: {res.get('slot')} | Exam: {res.get('exam')} | Sched: {res.get('schedule_raw')}")

with open("scraped_courses.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("\nDone! Saved to scraped_courses.json")
