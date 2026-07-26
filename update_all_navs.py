import os

# Define relative path updates for each app index file
apps = [
    ("enterprise-qr-asset-manager/index.html", "../"),
    ("he_thong_hop_nhat_fifo_sap/index.html", "../"),
    ("procurement_supplier_system/index.html", "../"),
    ("wms_vdt_sap4hana/index.html", "../"),
    ("mo_app_tru_kho.html", ""),
    ("it_asset.html", ""),
    ("warehouse_financial_system/index.html", "../"),
    ("kiem_ke_kho.html", ""),
    ("visual-bin-location-manager/index.html", "../"),
    ("factory-photo-guide/index.html", "../"),
    ("sap_s4hana_ebook/index.html", "../"),
    ("knowledge-graph/index.html", "../"),
]

def make_nav(rel):
    return f'''    <!-- UNIVERSAL NAV: Scrollable horizontal, scales to unlimited repos -->
    <nav class="nav-root" id="nav-root">
      <div class="nav-inner">
        <button class="nav-arr" id="nav-l" onclick="navScroll(-1)" title="Trước">&#8249;</button>
        <div class="nav-fade-l" id="nav-fl"></div>
        <div class="nav-track" id="nav-track">
          <span class="nav-label">Chuyển:</span>
          <a href="{rel}index.html" style="color:#38bdf8;background:rgba(56,189,248,.15);border-color:rgba(56,189,248,.3);">🏠 Hub</a>
          <a href="https://github.com/levutuong01694242789-sketch/hub-quan-ly-kho#readme" target="_blank" style="color:#34d399;background:rgba(52,211,153,.12);">📖 Master</a>
          <a href="{rel}enterprise-qr-asset-manager/index.html" style="color:#93c5fd;background:rgba(59,130,246,.15);">1.🏢 Tài Sản QR</a>
          <a href="{rel}he_thong_hop_nhat_fifo_sap/index.html" style="color:#c4b5fd;background:rgba(139,92,246,.12);">2.🌟 Hợp Nhất</a>
          <a href="{rel}procurement_supplier_system/index.html" style="color:#5eead4;background:rgba(20,184,166,.12);">3.🛒 Thu Mua</a>
          <a href="{rel}wms_vdt_sap4hana/index.html" style="color:#7dd3fc;background:rgba(14,165,233,.12);">4.🏢 Kho 2D SAP</a>
          <a href="{rel}mo_app_tru_kho.html" style="color:#a5b4fc;background:rgba(99,102,241,.12);">5.📊 Trữ Kho PO</a>
          <a href="{rel}it_asset.html" style="color:#d8b4fe;background:rgba(168,85,247,.12);">6.💻 IT Asset</a>
          <a href="{rel}quan_ly_kho_fifo/README.md" style="color:#fcd34d;background:rgba(245,158,11,.12);">7.📦 Engine FIFO</a>
          <a href="{rel}warehouse_financial_system/index.html" style="color:#6ee7b7;background:rgba(16,185,129,.12);">8.💰 Tài Chính</a>
          <a href="{rel}kiem_ke_kho.html" style="color:#fca5a5;background:rgba(239,68,68,.12);">9.📋 Kiểm Kê Kho</a>
          <a href="{rel}visual-bin-location-manager/index.html" style="color:#67e8f9;background:rgba(6,182,212,.15);">10.📷 Vị Trí Ảnh</a>
          <a href="{rel}factory-photo-guide/index.html" style="color:#fdba74;background:rgba(234,88,12,.12);">11.🏭 Factory Guide</a>
          <a href="{rel}sap_s4hana_ebook/index.html" style="color:#fde68a;background:rgba(234,179,8,.15);">12.📘 SAP E-Book</a>
          <a href="{rel}knowledge-graph/index.html" style="color:#e879f9;background:rgba(217,70,239,.15);">13.🕸️ Knowledge Graph</a>
        </div>
        <div class="nav-fade-r" id="nav-fr"></div>
        <button class="nav-arr" id="nav-r" onclick="navScroll(1)" title="Sau">&#8250;</button>
      </div>
    </nav>'''

nav_css = '''
        /* ====== UNIVERSAL SCROLLABLE NAV ====== */
        .nav-root { position: sticky; top: 0; z-index: 9999; background: #020617; border-bottom: 1px solid #1e293b; box-shadow: 0 2px 16px rgba(0,0,0,.5); }
        .nav-inner { display: flex; align-items: center; height: 40px; position: relative; }
        .nav-track { flex: 1; overflow-x: auto; overflow-y: hidden; display: flex; align-items: center; gap: 4px; padding: 0 6px; scrollbar-width: none; -ms-overflow-style: none; scroll-behavior: smooth; }
        .nav-track::-webkit-scrollbar { display: none; }
        .nav-fade-l, .nav-fade-r { position: absolute; top: 0; bottom: 0; width: 36px; pointer-events: none; z-index: 2; transition: opacity .2s; }
        .nav-fade-l { left: 32px; background: linear-gradient(to right, #020617 0%, transparent 100%); }
        .nav-fade-r { right: 32px; background: linear-gradient(to left, #020617 0%, transparent 100%); }
        .nav-arr { flex-shrink: 0; width: 30px; height: 40px; background: #020617; border: none; color: #475569; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: color .15s; z-index: 3; }
        .nav-arr:hover { color: #e2e8f0; }
        .nav-arr:disabled { opacity: .2; cursor: default; }
        .nav-track a { flex-shrink: 0; display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 7px; border: 1px solid transparent; font-size: 11px; font-weight: 600; text-decoration: none; white-space: nowrap; transition: background .15s, border-color .15s, transform .1s; }
        .nav-track a:hover { transform: translateY(-1px); filter: brightness(1.15); }
        .nav-track .nav-label { flex-shrink: 0; font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; color: #334155; white-space: nowrap; padding: 0 2px; }
'''

nav_js = '''
    <script>
    function navScroll(dir) { const t = document.getElementById('nav-track'); if(t) t.scrollBy({ left: dir * 180, behavior: 'smooth' }); }
    function updateNavFade() {
      const t = document.getElementById('nav-track'); if(!t) return;
      const fl = document.getElementById('nav-fl'), fr = document.getElementById('nav-fr');
      const nl = document.getElementById('nav-l'), nr = document.getElementById('nav-r');
      if(fl && fr && nl && nr) {
        const atStart = t.scrollLeft < 8, atEnd = t.scrollLeft + t.clientWidth >= t.scrollWidth - 8;
        fl.style.opacity = atStart ? '0' : '1'; fr.style.opacity = atEnd ? '0' : '1';
        nl.disabled = atStart; nr.disabled = atEnd;
      }
    }
    window.addEventListener('DOMContentLoaded', function() {
      const t = document.getElementById('nav-track');
      if(t) { t.addEventListener('scroll', updateNavFade); updateNavFade(); }
      const cur = location.pathname.split('/').pop() || 'index.html';
      document.querySelectorAll('.nav-track a').forEach(a => {
        const href = a.getAttribute('href').split('/').pop();
        if (href === cur || (cur === '' && href === 'index.html')) {
          a.style.outline = '1.5px solid currentColor'; a.style.outlineOffset = '-1px'; a.style.fontWeight = '900';
        }
      });
    });
    </script>
'''

updated_count = 0
for rel_path, rel in apps:
    if os.path.exists(rel_path):
        with open(rel_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Inject CSS before </head> if nav-root not in CSS
        if 'nav-root' not in content:
            if '</head>' in content:
                content = content.replace('</head>', f'<style>{nav_css}</style>\n</head>', 1)
            
            # Replace old nav or insert after <body>
            if '<nav' in content:
                # Find closing nav tag
                end_nav_idx = content.find('</nav>')
                start_nav_idx = content.rfind('<nav', 0, end_nav_idx)
                if start_nav_idx != -1 and end_nav_idx != -1:
                    content = content[:start_nav_idx] + make_nav(rel) + content[end_nav_idx+6:]
            else:
                if '<body>' in content:
                    content = content.replace('<body>', f'<body>\n{make_nav(rel)}', 1)
            
            # Add JS before </body>
            if 'navScroll' not in content and '</body>' in content:
                content = content.replace('</body>', f'{nav_js}\n</body>', 1)
            
            with open(rel_path, 'w', encoding='utf-8-sig') as f:
                f.write(content)
            updated_count += 1
            print(f"Updated {rel_path}")

print(f"Total apps updated: {updated_count}")
