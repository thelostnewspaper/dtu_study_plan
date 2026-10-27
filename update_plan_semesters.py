import json
import re

with open('official_courses_verified_clean.json', 'r', encoding='utf-8') as f:
    verified = json.load(f)

with open('frontend/src/courses.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Update objects inside PLAN_SEMESTERS and FLEX_ALTERNATIVES
# Look for pattern: { code: 'XXXXX', ..., slot: '...', exam: '...' }
def replacer(match):
    full = match.group(0)
    code_m = re.search(r"code:\s*['\"](\d{5})['\"]", full)
    if not code_m:
        return full
    code = code_m.group(1)
    if code in verified:
        data = verified[code]
        slot = data.get('slot')
        exam = data.get('exam')
        if slot:
            full = re.sub(r"slot:\s*['\"][^'\"]*['\"]", f"slot: '{slot}'", full)
        if exam:
            full = re.sub(r"exam:\s*['\"][^'\"]*['\"]", f"exam: '{exam}'", full)
    return full

# Apply to all course object literals in PLAN_SEMESTERS & FLEX_ALTERNATIVES
new_content = re.sub(r"\{[^{}]*code:\s*['\"]\d{5}['\"][^{}]*\}", replacer, content)

with open('frontend/src/courses.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated PLAN_SEMESTERS and FLEX_ALTERNATIVES in frontend/src/courses.js")
