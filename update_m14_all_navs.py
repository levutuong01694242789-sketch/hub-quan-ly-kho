import os

apps = [
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

m14_nav_item = '<a href="{rel}mobile-meeting-notetaker/index.html" style="color:#34d399;background:rgba(16,185,129,.15);">14.📱 Mobile Notetaker</a>'

for rel_path, rel in apps:
    if os.path.exists(rel_path):
        with open(rel_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        if 'mobile-meeting-notetaker/index.html' not in content:
            target = '<a href="{rel}knowledge-graph/index.html"'.replace('{rel}', rel)
            replacement = m14_nav_item.replace('{rel}', rel) + '\n          ' + target
            content = content.replace(target, replacement)
            
            with open(rel_path, 'w', encoding='utf-8-sig') as f:
                f.write(content)
            print(f"Updated nav in {rel_path}")

print("All nav bars updated with Module 14!")
