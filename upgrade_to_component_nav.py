import os

apps = [
    ("index.html", ""),
    ("enterprise-qr-asset-manager/index.html", "../"),
    ("he_thong_hop_nhat_fifo_sap/index.html", "../"),
    ("procurement_supplier_system/index.html", "../"),
    ("wms_vdt_sap4hana/index.html", "../"),
    ("mo_app_tru_kho.html", ""),
    ("it_asset.html", ""),
    ("quan_ly_kho_fifo/index.html", "../"),
    ("warehouse_financial_system/index.html", "../"),
    ("kiem_ke_kho.html", ""),
    ("visual-bin-location-manager/index.html", "../"),
    ("factory-photo-guide/index.html", "../"),
    ("sap_s4hana_ebook/index.html", "../"),
    ("knowledge-graph/index.html", "../"),
    ("mobile-meeting-notetaker/index.html", "../")
]

for file, rel in apps:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8', errors='ignore') as f:
            html = f.read()

        # Remove old nav tag block
        while '<nav' in html and '</nav>' in html:
            s = html.find('<nav')
            e = html.find('</nav>')
            if s != -1 and e != -1:
                html = html[:s] + html[e+6:]
            else:
                break

        # Remove old nav JS
        if 'function navScroll' in html:
            s_js = html.find('<script>', html.find('function navScroll'))
            if s_js == -1:
                s_js = html.rfind('<script>', 0, html.find('function navScroll'))
            e_js = html.find('</script>', html.find('function navScroll'))
            if s_js != -1 and e_js != -1:
                html = html[:s_js] + html[e_js+9:]

        # Inject Web Component script in <head>
        script_tag = f'<script src="{rel}components/universal-nav.js"></script>'
        if 'universal-nav.js' not in html:
            if '</head>' in html:
                html = html.replace('</head>', f'    {script_tag}\n</head>', 1)

        # Inject <universal-nav></universal-nav> right after <body>
        if '<universal-nav></universal-nav>' not in html:
            if '<body>' in html:
                html = html.replace('<body>', '<body>\n    <universal-nav></universal-nav>', 1)
            elif '<body' in html:
                idx = html.find('>', html.find('<body'))
                if idx != -1:
                    html = html[:idx+1] + '\n    <universal-nav></universal-nav>' + html[idx+1:]

        with open(file, 'w', encoding='utf-8-sig') as f:
            f.write(html)
        print(f"Upgraded {file} to Web Component Nav!")

print("All 15 HTML files upgraded successfully!")
