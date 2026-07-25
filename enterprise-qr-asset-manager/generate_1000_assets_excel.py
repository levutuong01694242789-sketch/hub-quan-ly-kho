import random
import csv
import os

# Create 1,000 realistic sample enterprise asset records
categories = [
    ("Pallet Nhựa", "Pallet Nhựa Đen 1200x1000mm", "1200x1000x150mm", "DEPT-WAREHOUSE", "Kho Vật Tư Tổng - Dãy A", 450000),
    ("Pallet Nhựa", "Pallet Nhựa Xanh Lót Sàn", "1100x1100x120mm", "DEPT-WAREHOUSE", "Kho Vật Tư Tổng - Dãy B", 380000),
    ("Pallet Nhựa", "Pallet Nhựa 2 Mặt Tải Trọng Nặng", "1200x1200x160mm", "DEPT-WAREHOUSE", "Kho Hàng A1 - Kệ Heavy Duty", 620000),
    ("Pallet Gỗ", "Pallet Gỗ Thông Xuất Khẩu Euro", "1200x800x144mm", "DEPT-WAREHOUSE", "Kho Xuất Hàng C", 250000),
    ("Thiết Bị IT", "Laptop Dell Latitude 5440 i7", "Core i7 16GB 512GB", "DEPT-IT", "Tầng 4 - Phòng IT", 22500000),
    ("Thiết Bị IT", "Màn Hình Dell UltraSharp 27 inch 4K", "U2723QE", "DEPT-IT", "Tầng 4 - Phòng IT", 12800000),
    ("Thiết Bị IT", "Máy In Tem Nhãn QR Code Thermal", "Xprinter XP-420B", "DEPT-IT", "Tầng 4 - Phòng IT", 2800000),
    ("Thiết Bị Văn Phòng", "Ghế Xoay Lưới Công Trình Ergonomic", "Hòa Phát EG-01", "DEPT-OFFICE", "Tầng 5 - Khối Văn Phòng", 1850000),
    ("Thiết Bị Văn Phòng", "Máy Điều Hòa Âm Trần Daikin 36000BTU", "FCNQ36MV1", "DEPT-OFFICE", "Tầng 5 - Phòng Họp Lớn", 38000000),
    ("Máy Móc Nhà Máy", "Xe Nâng Điện Toyota 2.5 Tấn", "Toyota 8FBN25", "DEPT-FACTORY", "Nhà Máy A1 - Cầu Cảng", 420000000),
    ("Máy Móc Nhà Máy", "Máy Nén Khí Piston 15HP", "Pegasus T-15", "DEPT-FACTORY", "Xưởng Cơ Khí A2", 35000000),
    ("Dụng Cụ Công Nghiệp", "Bộ Máy Hàn TIG Điện Tử 250A", "Jasic TIG-250A", "DEPT-WAREHOUSE", "Kho Dụng Cụ Kỹ Thuật", 12500000)
]

statuses = ["ACTIVE", "ACTIVE", "ACTIVE", "ACTIVE", "SPARE", "LOANED", "REPAIR"]
custodians = ["Lê Vũ Tường", "Trần Văn Nam", "Nguyễn Văn Hùng", "Phạm Minh Đức", "Nguyễn Thị Hoa", "Hoàng Văn Thái", "Phạm Thị Lan"]

rows = []
for i in range(1, 1001):
    cat, name, model, dept, loc, base_price = random.choice(categories)
    asset_id = f"AST-{i:05d}"
    serial = f"SN-2026-{random.randint(10000, 99999)}"
    custodian = random.choice(custodians)
    status = random.choice(statuses)
    cost = base_price + random.randint(-5000, 5000) * 10
    
    rows.append({
        "Mã Tài Sản": asset_id,
        "Tên Thiết Bị": f"{name} #{i}",
        "Danh Mục": cat,
        "Model/Kích Thước": model,
        "Số Serial/Mã Lô": serial,
        "Phòng Ban": dept,
        "Vị Trí": f"{loc} - Ô {random.randint(1, 100)}",
        "Người Quản Lý": custodian,
        "Trạng Thái": status,
        "Nguyên Giá (VNĐ)": cost,
        "Ngày Mua": f"2026-01-{(i % 28) + 1:02d}",
        "Ghi Chú": f"Tài sản mẫu kiểm thử số {i}"
    })

out_dir = r"C:\Users\My ROG\.gemini\antigravity\scratch\enterprise-qr-asset-manager"
csv_path = os.path.join(out_dir, "Danh_Sach_1000_Tai_San_Mau.csv")

with open(csv_path, "w", encoding="utf-8-sig", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    writer.writeheader()
    writer.writerows(rows)

print(f"Generated {len(rows)} asset records cleanly into {csv_path}!")
