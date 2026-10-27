import requests
from bs4 import BeautifulSoup
import re

s = requests.Session()
s.headers.update({
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
})

url = 'https://kurser.dtu.dk/course/02807'
res = s.get(url, timeout=12)
if 'loginFrame' in res.text:
    m = re.search(r'src="(\?forceLogin=true[^"]*)"', res.text)
    if m:
        s.get(f'https://kurser.dtu.dk/course/02807{m.group(1)}')
        res = s.get(url, timeout=12)

soup = BeautifulSoup(res.text, 'html.parser')
for tr in soup.find_all('tr'):
    tds = tr.find_all(['td', 'th'])
    if len(tds) >= 2:
        label = tds[0].get_text(strip=True)
        val = tds[1].get_text(strip=True)
        print(f"[{label}] -> [{val}]")
