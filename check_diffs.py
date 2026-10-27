import json
import re

with open('official_courses_verified.json', 'r', encoding='utf-8') as f:
    verified = json.load(f)

# Fix 38402, 38403 (June), 38404, 38405 (August)
for c in ['38402', '38403']:
    if c in verified:
        verified[c]['slot'] = 'Jun'
        verified[c]['semesters'] = ['June']

for c in ['38404', '38405']:
    if c in verified:
        verified[c]['slot'] = 'Aug'
        verified[c]['semesters'] = ['August']

# For 02506, 34761, 34764, 42186 that are not found on kurser.dtu.dk currently,
# keep their existing slot from courses.js if empty
existing_fallbacks = {
    "02506": {"slot": "F5B", "exam": "Oral"},
    "34761": {"slot": "F4A", "exam": "Oral"},
    "34764": {"slot": "Jan", "exam": "Project"},
    "42186": {"slot": "F5B", "exam": "Written 4h"}
}
for c, val in existing_fallbacks.items():
    if c in verified and not verified[c]['slot']:
        verified[c]['slot'] = val['slot']
        verified[c]['exam'] = val['exam']

with open('frontend/src/courses.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's see differences in slot and exam
diffs = []
for code, data in verified.items():
    # Find course line in content
    pattern = rf'"{code}":\s*\{{([^}}]+)\}}'
    m = re.search(pattern, content)
    if m:
        body = m.group(1)
        cur_slot_m = re.search(r'slot:\s*"([^"]*)"', body)
        cur_exam_m = re.search(r'exam:\s*"([^"]*)"', body)
        cur_slot = cur_slot_m.group(1) if cur_slot_m else ""
        cur_exam = cur_exam_m.group(1) if cur_exam_m else ""
        
        new_slot = data['slot']
        new_exam = data['exam']
        
        if cur_slot != new_slot or cur_exam != new_exam:
            diffs.append({
                'code': code,
                'name': data.get('title') or code,
                'old_slot': cur_slot,
                'new_slot': new_slot,
                'old_exam': cur_exam,
                'new_exam': new_exam
            })

print(f"Total courses with changes: {len(diffs)} / {len(verified)}")
print("\nSample changes:")
for d in diffs[:25]:
    print(f"[{d['code']}] slot: '{d['old_slot']}' -> '{d['new_slot']}' | exam: '{d['old_exam']}' -> '{d['new_exam']}' ({d['name'][:30]})")

# Save cleaned verified
with open('official_courses_verified_clean.json', 'w', encoding='utf-8') as f:
    json.dump(verified, f, indent=2, ensure_ascii=False)
