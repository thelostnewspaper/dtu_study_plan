import requests
from bs4 import BeautifulSoup
import re

s = requests.Session()
s.headers.update({'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})

missing_codes = ['02506', '34761', '34764', '42186']

for c in missing_codes:
    print(f"=== Checking {c} ===")
    url = f"https://kurser.dtu.dk/course/{c}"
    res = s.get(url)
    if 'loginFrame' in res.text:
        m = re.search(r'src="(\?forceLogin=true[^"]*)"', res.text)
        if m:
            s.get(f"https://kurser.dtu.dk/course/{c}{m.group(1)}")
            res = s.get(url)
    
    soup = BeautifulSoup(res.text, 'html.parser')
    h1 = soup.find(['h1', 'h2'])
    print("Title:", h1.text.strip() if h1 else "Not found")
    
    # Check if there is a redirect or archive
    # Let's search text for Schedule and Exam
    for p in soup.find_all(['p', 'div', 'tr']):
        txt = p.get_text().replace('\n', ' ').strip()
        if any(k in txt for k in ['Schedule', 'Skema', 'Exam', 'Eksamen', 'Assessment', 'Bedømmelse']) and len(txt) < 150:
            print("  ->", txt)
