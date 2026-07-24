# Hub Quản Lý Kho Vận & IT Supply Chain - Lê Vũ Tường

Trực quan hóa & Tự động hóa Kho Vận Chuẩn SAP S/4HANA & Quản lý Tài Sản IT.

👉 **Trang Web Hub Trực Tuyến**: [https://levutuong01694242789-sketch.github.io/hub-quan-ly-kho/](https://levutuong01694242789-sketch.github.io/hub-quan-ly-kho/)

---

## 🌟 Bộ Ứng Dụng Hợp Nhất & Độc Lập

### 1. 🌟 Hệ Thống Hợp Nhất 1-Chạm All-in-One (`he_thong_hop_nhat_fifo_sap/`)
- Tự động kết nối 2 quy trình trong 1 cú nhấp chuột: **Phân bổ nhặt hàng FIFO** (theo Lô/Hạn dùng) ➔ **Map 4,032 vị trí kho mới chuẩn SAP S/4HANA & Vùng Đệm Sàn (TW/VW/VL)** ➔ **Trừ tồn kho thời gian thực** & **Sơ đồ ma trận 2D trực quan**.
- Chạy 1-Click bằng `CHAY_HE_THONG_HOP_NHAT_1_CHAM.bat`.

### 2. 🏢 Kho Động SAP S/4HANA & Sơ Đồ Ma Trận 2D (`wms_vdt_sap4hana/`)
- Sơ đồ ma trận 4,032 vị trí kệ (Dãy A-H) + 6 Vùng đệm sàn (`TW_SX1-1`, `VL_PA_001_CD-1`...).
- Thống kê bóc tách đa đơn vị tính (Kg, Thùng, Cái, Cuộn, Met, Bộ, Đôi, Chai, Vắt).
- Chế độ giao diện Sáng / Tối linh hoạt.

### 3. 📦 Xuất Kho FIFO Tự Động (`quan_ly_kho_fifo/`)
- Engine tự động ghép nối nhu cầu xuất hàng với tồn kho thực tế theo nguyên tắc FIFO (Hạn dùng/Ngày nhập) & xuất báo cáo Excel.

### 4. 📊 Định Mức Trữ Kho 3 Ngày & Đơn Mua Hàng PO (`mo_app_tru_kho.html`)
- Tự động tính điểm ROP, định mức trữ kho 3 ngày và xuất báo cáo Đơn mua hàng PO Excel chuẩn phòng kế hoạch.

### 5. 💻 Quản Lý Tài Sản IT & Mã QR (`it_asset.html`)
- Quản lý cấp phát tài sản IT (Laptop, Máy in, Thiết bị mạng), quét mã QR Camera & tạo tem nhãn chuyên nghiệp.

---

## 🚀 Cấu Trúc Repository
```
hub-quan-ly-kho/
├── index.html                   # Trang chủ Portal Hub Web App
├── he_thong_hop_nhat_fifo_sap/  # Dự án Hợp Nhất 1-Chạm FIFO & SAP WMS
├── wms_vdt_sap4hana/            # Dự án Kho Động SAP S/4HANA & Ma Trận 2D
├── quan_ly_kho_fifo/            # Dự án Phân bổ Xuất kho FIFO
├── mo_app_tru_kho.html          # Web App Trữ Kho 3 Ngày & PO
└── it_asset.html                # Web App Quản Lý Tài Sản IT
```
