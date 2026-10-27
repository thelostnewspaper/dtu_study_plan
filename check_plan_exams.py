import json

with open('official_courses_verified.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Courses in recommended plan
rec_codes = ['38113', '02270', '02269', '12105', '02267', '02280', '02291', '02582', '02806', '02417', '38402', '02456', '02517', '02258', '02262', '02231', '02234', '02287', '02268', '02807', '02289', '02476']

for c in rec_codes:
    item = data.get(c, {})
    title = (item.get("title") or "")[:28]
    slot = item.get("slot") or ""
    exam = item.get("exam") or ""
    # let's see if we have date_of_exam
    date_exam = item.get("date_of_exam") or ""
    print(f"{c}: {title:28} | slot={slot:5} | exam={exam:20} | date_of_exam={date_exam}")
