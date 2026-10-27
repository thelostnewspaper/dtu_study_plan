import requests
from bs4 import BeautifulSoup
import re

s = requests.Session()
s.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
})

def check_course(code):
    url = f'https://kurser.dtu.dk/course/{code}'
    res = s.get(url, timeout=12)
    if 'loginFrame' in res.text:
        m = re.search(r'src="(\?forceLogin=true[^"]*)"', res.text)
        if m:
            s.get(f'https://kurser.dtu.dk/course/{code}{m.group(1)}')
            res = s.get(url, timeout=12)

    soup = BeautifulSoup(res.text, 'html.parser')
    print(f"=== {code} ===")
    for row in soup.find_all(['tr', 'div']):
        # If it has label/value structure or class
        txt = row.get_text(' ', strip=True)
        if any(k in txt.lower() for k in ['assessment', 'evaluation', 'exam', 'schedule']):
            if len(txt) < 200:
                print(txt)

check_course('02807')
