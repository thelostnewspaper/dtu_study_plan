import requests
from bs4 import BeautifulSoup
import re
import json

s = requests.Session()
s.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
})

def fetch_kurser(code):
    url = f"https://kurser.dtu.dk/course/{code}"
    res = s.get(url)
    if 'loginFrame' in res.text:
        m = re.search(r'src="(\?forceLogin=true[^"]*)"', res.text)
        if m:
            s.get(f"https://kurser.dtu.dk/course/{code}{m.group(1)}")
            res = s.get(url)
            
    soup = BeautifulSoup(res.text, 'html.parser')
    
    # Dump relevant fields
    fields = {}
    
    # Title
    title_el = soup.find('h1') or soup.find('h2')
    if title_el:
        fields['title'] = title_el.text.strip()
        
    for dt in soup.find_all(['dt', 'th', 'label', 'div']):
        t = dt.text.strip()
        if any(k in t for k in ['Schedule', 'Skemagruppe', 'Form of examination', 'Eksamensform', 'Evaluation', 'Point', 'ECTS', 'General course objectives']):
            next_el = dt.find_next_sibling()
            if next_el:
                fields[t] = next_el.text.strip()
                
    # Also look at all table rows
    for tr in soup.find_all('tr'):
        tds = tr.find_all(['td', 'th'])
        if len(tds) >= 2:
            k = tds[0].text.strip()
            v = tds[1].text.strip()
            if any(term in k for term in ['Schedule', 'Skemagruppe', 'Exam', 'Eksamen', 'Evaluation', 'ECTS', 'Point']):
                fields[k] = v
                
    return fields

for c in ['02289', '02258', '02456', '02506', '34761', '34764', '42186']:
    print(f"=== {c} ===")
    data = fetch_kurser(c)
    print(json.dumps(data, indent=2, ensure_ascii=False))
