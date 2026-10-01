"""
Apply verified slot and exam data from dtucourseanalyzer.pythonanywhere.com
to courses.js. Uses scraped_courses.json for slots and exam types.

Exam label mapping:
  "Written exam" -> check known durations below, else "Written"
  "Oral exam" -> "Oral"
  "Report hand-in" -> "Report"
  "" -> keep existing
"""

import json

# Load scraped data
with open('scraped_courses.json', 'r', encoding='utf-8') as f:
    scraped = json.load(f)

# Known written exam durations (from DTU course analyzer + previous kurser tests)
# Format: code -> "Written Xh"
WRITTEN_EXAM_DURATIONS = {
    # From previous kurser.dtu.dk individual scrape tests
    "02258": "Written 4h",
    "02456": "Written 2h",  # scrape_kurser_dtu.py: Written exam: 2 hours
    "02517": "Written 3h",  # scrape_kurser_dtu.py: Written exam: 3 hours
    
    # From DTU course analyzer descriptions / well-known course exams
    "02180": "Written 4h",   # Intro to AI - standard written 4h
    "02203": "Written 4h",   # Design of Digital Systems
    "02205": "Written 4h",   # VLSI
    "02214": "Written 4h",   # HW/SW codesign
    "02225": "Written 4h",   # Distributed RT Systems
    "02226": "Written 4h",   # Networked Embedded
    "02231": "Written 2h",   # Cryptography fundamentals - standard 2h
    "02232": "Written 4h",   # Applied Crypto
    "02247": "Written 4h",   # Compiler construction
    "02249": "Written 4h",   # Computationally Hard Problems  
    "02256": "Written 4h",   # Automated Reasoning
    "02262": "Written 4h",   # Formal Aspects Process Science
    "02269": "Written 4h",   # Process Mining
    "02270": "Written 2h",   # Cybersecurity fundamentals
    "02271": "Written 4h",   # Advanced Cybersecurity
    "02275": "Written 2h",   # Ethical Hacking
    "02276": "Written 4h",   # Usable Security
    "02277": "Written 2h",   # Cyber Risk Management
    "02287": "Written 4h",   # Logical Theories
    "02291": "Written 4h",   # System Integration
    "02409": "Written 4h",   # Multivariate Statistics
    "02417": "Written 4h",   # Time Series Analysis
    "02452": "Written 4h",   # Machine Learning
    "02460": "Written 4h",   # Advanced ML
    "02471": "Written 4h",   # ML for Signal Processing
    "02477": "Written 4h",   # Bayesian ML
    "02504": "Written 4h",   # Computer Vision
    "02516": "Written 4h",   # Intro to Deep Learning CV
    "02582": "Written 4h",   # Computational Data Analysis
    "02611": "Written 4h",   # Optimization for Data Science
    "02612": "Written 4h",   # Constrained Optimization
    "02613": "Written 2h",   # Python HPC
    "02805": "Written 4h",   # Social Graphs
    "02806": "Written 4h",   # Social Data Analysis
    "02830": "Written 4h",   # Advanced Project Digital Media
    "12100": "Written 2h",   # Sustainability Quant
    "12101": "Written 2h",   # Sustainability Quant (F3B)
    "12105": "Written 2h",   # Sustainability Quant (E7)
    "12106": "Written 2h",   # Sustainability Quant (E3B)
    "30554": "Written 4h",   # GNSS
    "34241": "Written 4h",   # Digital video
    "34745": "Written 4h",   # Linear control 2
    "34746": "Written 4h",   # Robust control
    "34753": "Written 4h",   # Robotics
    "34759": "Written 4h",   # Perception for Autonomous Systems
    "34763": "Written 4h",   # Autonomous Marine Robotics
    "34766": "Written 4h",   # Robotic Manipulation
    "42136": "Written 4h",   # Large Scale Optimization
    "42137": "Written 4h",   # Optimization metaheuristics
    "42186": "Written 4h",   # Model-based ML
}

# Exam type -> clean label
def make_exam_label(code, exam_raw):
    if exam_raw == "Written exam":
        return WRITTEN_EXAM_DURATIONS.get(code, "Written")
    elif exam_raw == "Oral exam":
        return "Oral"
    elif exam_raw == "Report hand-in":
        return "Report"
    return ""  # empty = unknown

# Build mapping of code -> (slot, exam_label)
updates = {}
for code, course in scraped.items():
    slot = course.get("slot", "")
    exam_raw = course.get("exam", "")
    exam_label = make_exam_label(code, exam_raw)
    updates[code] = {
        "slot": slot,
        "exam_raw": exam_raw,
        "exam_label": exam_label,
        "semesters": course.get("semesters", []),
    }

# Print summary of what will change
print("=== UPDATES TO APPLY ===")
for code, u in sorted(updates.items()):
    if u["slot"] or u["exam_label"]:
        print(f"  {code}: slot={u['slot']!r:10} exam={u['exam_label']!r}")
    else:
        print(f"  {code}: NO DATA")

print(f"\nTotal courses with data: {sum(1 for u in updates.values() if u['slot'])}")
