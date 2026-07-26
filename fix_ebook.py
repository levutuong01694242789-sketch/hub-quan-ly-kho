import os

with open('sap_s4hana_ebook/index.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

if 'universal-nav.js' not in html:
    html = html.replace('</head>', '    <script src="../components/universal-nav.js"></script>\n</head>', 1)

if '<universal-nav></universal-nav>' not in html:
    html = html.replace('<body>', '<body>\n    <universal-nav></universal-nav>', 1)

old_nav_str = '<nav class="nav-root" id="nav-root">'
if old_nav_str in html:
    s = html.find(old_nav_str)
    e = html.find('</nav>', s)
    if s != -1 and e != -1:
        html = html[:s] + html[e+6:]

with open('sap_s4hana_ebook/index.html', 'w', encoding='utf-8-sig') as f:
    f.write(html)

print("Updated SAP E-Book successfully!")
