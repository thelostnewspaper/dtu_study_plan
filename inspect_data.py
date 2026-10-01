import json

with open('scraped_courses.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Show all entries
for k, v in data.items():
    slot = v.get("slot", "")
    exam = v.get("exam", "")
    name = v.get("name", "")[:50]
    semesters = v.get("semesters", [])
    print(f"{k}: slot={slot} | sem={semesters} | exam={exam} | name={name}")

print()
print("Total:", len(data))
print()
# Unique exam values
exams = set(v.get("exam","") for v in data.values())
print("Unique exam types:", exams)
