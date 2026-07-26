import glob, os

apps = [
    'index.html',
    'enterprise-qr-asset-manager/index.html',
    'he_thong_hop_nhat_fifo_sap/index.html',
    'procurement_supplier_system/index.html',
    'wms_vdt_sap4hana/index.html',
    'mo_app_tru_kho.html',
    'it_asset.html',
    'quan_ly_kho_fifo/index.html',
    'warehouse_financial_system/index.html',
    'kiem_ke_kho.html',
    'visual-bin-location-manager/index.html',
    'factory-photo-guide/index.html',
    'sap_s4hana_ebook/index.html',
    'knowledge-graph/index.html',
    'mobile-meeting-notetaker/index.html'
]

clean_track = '''<div class="nav-track" id="nav-track">
          <span class="nav-label">Chuyển:</span>
          <a href="{rel}index.html" style="color:#38bdf8;background:rgba(56,189,248,.15);border-color:rgba(56,189,248,.3);">🏠 Hub</a>
          <a href="https://github.com/levutuong01694242789-sketch/hub-quan-ly-kho#readme" target="_blank" style="color:#34d399;background:rgba(52,211,153,.12);">📖 Master</a>
          <div class="nav-div"></div>
          <a href="{rel}enterprise-qr-asset-manager/index.html" style="color:#93c5fd;background:rgba(59,130,246,.15);">1.🏢 Tài Sản QR</a>
          <a href="{rel}he_thong_hop_nhat_fifo_sap/index.html" style="color:#c4b5fd;background:rgba(139,92,246,.12);">2.🌟 Hợp Nhất</a>
          <a href="{rel}procurement_supplier_system/index.html" style="color:#5eead4;background:rgba(20,184,166,.12);">3.🛒 Thu Mua</a>
          <a href="{rel}wms_vdt_sap4hana/index.html" style="color:#7dd3fc;background:rgba(14,165,233,.12);">4.🏢 Kho 2D SAP</a>
          <a href="{rel}mo_app_tru_kho.html" style="color:#a5b4fc;background:rgba(99,102,241,.12);">5.📊 Trữ Kho PO</a>
          <a href="{rel}it_asset.html" style="color:#d8b4fe;background:rgba(168,85,247,.12);">6.💻 IT Asset</a>
          <a href="{rel}quan_ly_kho_fifo/index.html" style="color:#fcd34d;background:rgba(245,158,11,.12);">7.📦 Engine FIFO</a>
          <a href="{rel}warehouse_financial_system/index.html" style="color:#6ee7b7;background:rgba(16,185,129,.12);">8.💰 Tài Chính</a>
          <a href="{rel}kiem_ke_kho.html" style="color:#fca5a5;background:rgba(239,68,68,.12);">9.📋 Kiểm Kê Kho</a>
          <a href="{rel}visual-bin-location-manager/index.html" style="color:#67e8f9;background:rgba(6,182,212,.15);">10.📷 Vị Trí Ảnh</a>
          <a href="{rel}factory-photo-guide/index.html" style="color:#fdba74;background:rgba(234,88,12,.12);">11.🏭 Factory Guide</a>
          <a href="{rel}sap_s4hana_ebook/index.html" style="color:#fde68a;background:rgba(234,179,8,.15);">12.📘 SAP E-Book</a>
          <a href="{rel}knowledge-graph/index.html" style="color:#e879f9;background:rgba(217,70,239,.15);">13.🕸️ Knowledge Graph</a>
          <a href="{rel}mobile-meeting-notetaker/index.html" style="color:#34d399;background:rgba(16,185,129,.15);">14.📱 Mobile Notetaker</a>
        </div>'''

for file in apps:
    if os.path.exists(file):
        rel = '../' if '/' in file else ''
        with open(file, 'r', encoding='utf-8', errors='ignore') as f:
            html = f.read()

        start_track = html.find('<div class="nav-track"')
        end_track = html.find('</div>', start_track)
        if start_track != -1 and end_track != -1:
            track_block = clean_track.format(rel=rel)
            html = html[:start_track] + track_block + html[end_track+6:]
            with open(file, 'w', encoding='utf-8-sig') as f:
                f.write(html)
            print(f'Cleaned nav in {file}')

print("All nav bars cleaned up perfectly!")
