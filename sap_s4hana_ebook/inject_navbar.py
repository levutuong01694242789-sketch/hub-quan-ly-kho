"""
Inject Hub Navbar vào SAP Ebook HTML
- Thêm navbar universal của hub vào đầu <body>
- Thêm link module 11 vào navbar
"""
import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

TARGET = r"C:\Users\My ROG\.gemini\antigravity\scratch\hub-quan-ly-kho\sap_s4hana_ebook\index.html"

NAVBAR = '''
    <!-- UNIVERSAL TOP NAVIGATION BAR - HUB QUAN LY KHO -->
    <nav style="background:#020617;border-bottom:1px solid #1e293b;padding:6px 16px;display:flex;align-items:center;justify-content:space-between;font-size:11px;font-weight:700;color:#fff;position:sticky;top:0;z-index:9998;flex-wrap:wrap;gap:4px;">
        <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;">
            <span style="color:#64748b;font-size:9px;text-transform:uppercase;letter-spacing:.06em;margin-right:4px;">Chuyển App:</span>
            <a href="../index.html" style="color:#38bdf8;background:rgba(56,189,248,.15);border:1px solid rgba(56,189,248,.35);padding:3px 8px;border-radius:6px;text-decoration:none;display:flex;align-items:center;gap:4px;">🏠 Hub</a>
            <a href="../enterprise-qr-asset-manager/index.html" style="color:#93c5fd;background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);padding:3px 7px;border-radius:6px;text-decoration:none;">1.🏢QR</a>
            <a href="../he_thong_hop_nhat_fifo_sap/index.html" style="color:#c4b5fd;background:rgba(139,92,246,.15);border:1px solid rgba(139,92,246,.3);padding:3px 7px;border-radius:6px;text-decoration:none;">2.🌟Hợp</a>
            <a href="../procurement_supplier_system/index.html" style="color:#5eead4;background:rgba(20,184,166,.15);border:1px solid rgba(20,184,166,.3);padding:3px 7px;border-radius:6px;text-decoration:none;">3.🛒Mua</a>
            <a href="../wms_vdt_sap4hana/index.html" style="color:#7dd3fc;background:rgba(14,165,233,.15);border:1px solid rgba(14,165,233,.3);padding:3px 7px;border-radius:6px;text-decoration:none;">4.🏭Kho</a>
            <a href="../mo_app_tru_kho.html" style="color:#a5b4fc;background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);padding:3px 7px;border-radius:6px;text-decoration:none;">5.📊PO</a>
            <a href="../it_asset.html" style="color:#d8b4fe;background:rgba(168,85,247,.15);border:1px solid rgba(168,85,247,.3);padding:3px 7px;border-radius:6px;text-decoration:none;">6.💻IT</a>
            <a href="../quan_ly_kho_fifo/README.md" style="color:#fcd34d;background:rgba(245,158,11,.15);border:1px solid rgba(245,158,11,.3);padding:3px 7px;border-radius:6px;text-decoration:none;">7.📦FIFO</a>
            <a href="../warehouse_financial_system/index.html" style="color:#6ee7b7;background:rgba(16,185,129,.15);border:1px solid rgba(16,185,129,.3);padding:3px 7px;border-radius:6px;text-decoration:none;">8.💰TC</a>
            <a href="../kiem_ke_kho.html" style="color:#fca5a5;background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.3);padding:3px 7px;border-radius:6px;text-decoration:none;">9.📋KK</a>
            <a href="../visual-bin-location-manager/index.html" style="color:#67e8f9;background:rgba(6,182,212,.15);border:1px solid rgba(6,182,212,.3);padding:3px 7px;border-radius:6px;text-decoration:none;">10.📷Ảnh</a>
            <a href="index.html" style="color:#f0a500;background:rgba(240,165,0,.2);border:1.5px solid rgba(240,165,0,.5);padding:3px 8px;border-radius:6px;text-decoration:none;font-weight:900;">11.📘SAP</a>
        </div>
        <span style="color:#475569;font-size:9px;display:none;" class="lg-only">📖 SAP S/4HANA GUIDE</span>
    </nav>
'''

print("[INFO] Doc file...")
with open(TARGET, 'r', encoding='utf-8') as f:
    html = f.read()

print(f"[INFO] File size: {len(html)/1024/1024:.1f} MB")

# Inject navbar sau <body>
if '<body>' in html:
    html = html.replace('<body>', '<body>' + NAVBAR, 1)
    print("[OK] Inject navbar vao <body>")
elif '<body ' in html:
    # body co attributes
    html = re.sub(r'(<body[^>]*>)', r'\1' + NAVBAR, html, count=1)
    print("[OK] Inject navbar vao <body ...>")

# Cập nhật header-h để tính thêm navbar height (~36px)
html = html.replace('--header:      56px;', '--header:      56px;\n  --hub-nav:     38px;')

# Fix padding-top để tính cả hub navbar  
html = html.replace(
    'padding-top:var(--header);',
    'padding-top:calc(var(--header) + 38px);'
)

# Ghi lại
with open(TARGET, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"[DONE] Da ghi file ({len(html)/1024/1024:.1f} MB)")
