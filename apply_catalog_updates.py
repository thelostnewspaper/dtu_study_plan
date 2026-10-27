import json
import re

with open('official_courses_verified_clean.json', 'r', encoding='utf-8') as f:
    verified = json.load(f)

# Helper function to update COURSE_CATALOG in a JS file
def update_course_catalog_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    updated_count = 0
    for code, data in verified.items():
        slot = data.get('slot', '')
        exam = data.get('exam', '')
        if not slot and not exam:
            continue

        # Look for "{code}": { ... }
        # Regex to find the course entry
        pattern = rf'("{code}":\s*\{{[^}}]*\}})'
        m = re.search(pattern, content)
        if m:
            entry = m.group(1)
            new_entry = entry
            if slot:
                new_entry = re.sub(r'slot:\s*"[^"]*"', f'slot: "{slot}"', new_entry)
            if exam:
                new_entry = re.sub(r'exam:\s*"[^"]*"', f'exam: "{exam}"', new_entry)
            
            if new_entry != entry:
                content = content.replace(entry, new_entry)
                updated_count += 1

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated {updated_count} course entries in {filepath}")

# Update frontend/src/courses.js
update_course_catalog_in_file('frontend/src/courses.js')

# Update backend/server.js
update_course_catalog_in_file('backend/server.js')
