import json
import re

with open("scraped_courses.json", "r", encoding="utf-8") as f:
    scraped = json.load(f)

# Read current courses.js
with open("frontend/src/courses.js", "r", encoding="utf-8") as f:
    courses_js = f.read()

# Extract COURSE_CATALOG JSON from courses.js
# Let's match each course entry in COURSE_CATALOG
current_catalog = {}
pattern = r'"(\d{5}|thesis)":\s*\{\s*name:\s*"([^"]*)",\s*ects:\s*([0-9.]+),\s*sem:\s*(\[[^\]]*\]),\s*cat:\s*"([^"]*)",\s*specs:\s*(\[[^\]]*\]),\s*slot:\s*"([^"]*)",\s*exam:\s*"([^"]*)"'

for m in re.finditer(pattern, courses_js):
    code = m.group(1)
    current_catalog[code] = {
        'name': m.group(2),
        'ects': float(m.group(3)),
        'sem': eval(m.group(4)),
        'cat': m.group(5),
        'specs': eval(m.group(6)),
        'slot': m.group(7),
        'exam': m.group(8)
    }

print(f"Loaded {len(current_catalog)} current courses and {len(scraped)} scraped courses.\n")

diffs = []
for code, curr in current_catalog.items():
    if code == 'thesis':
        continue
    sc = scraped.get(code)
    if not sc:
        print(f"Missing scraped info for {code}")
        continue
    
    sc_slot = sc.get('slot', '')
    sc_exam = sc.get('exam', '')
    sc_sched = sc.get('schedule_raw', '')
    
    # Check if slot or exam differs
    slot_diff = curr['slot'] != sc_slot if sc_slot else False
    
    print(f"Course {code} ({curr['name']}):")
    print(f"  Current: Slot='{curr['slot']}', Exam='{curr['exam']}'")
    print(f"  Scraped: Sched='{sc_sched}', Slot='{sc_slot}', Exam='{sc_exam}'")
    print("-" * 50)
