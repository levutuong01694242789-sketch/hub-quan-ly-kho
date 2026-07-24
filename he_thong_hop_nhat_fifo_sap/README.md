# Unified WMS - FIFO Allocation & SAP S/4HANA Dynamic Warehouse System

Hệ Thống Hợp Nhất 1-Chạm: Tự Động Phân Bổ Nhặt Hàng FIFO & Quản Lý Kho Động SAP S/4HANA.

## 🌟 Tính Năng Nổi Bật
- **Hợp Nhất 1-Chạm (All-in-One)**: Tự động kết nối 2 quy trình: Phân bổ nhặt hàng FIFO ➔ Map 4,032 vị trí kho chuẩn SAP S/4HANA & Vùng Đệm Sàn (`TW_`, `VW_`, `VL_`).
- **Sơ Đồ Ma Trận Kho 2D Trực Quan**: Đa chế độ ☀️ Light / 🌙 Dark Mode, tìm kiếm tức thì, bộ lọc theo Kệ A-H / Tầng / Vùng Đệm.
- **Thống Kê Đa Đơn Vị Tính (Multi-Unit)**: Phân loại minh bạch `Kg`, `Thùng`, `Cái`, `Cuộn`, `Met`, `Bộ`, `Đôi`, `Chai`, `Vắt`.
- **Báo Cáo Excel Hợp Nhất**: Xuất đầy đủ 4 sheet chi tiết (Nhặt FIFO, Tồn kho còn lại, Sơ đồ vị trí SAP).

## 📁 Cấu Trúc Dự Án
```
HE_THONG_HOP_NHAT_FIFO_SAP/
├── CHAY_HE_THONG_HOP_NHAT_1_CHAM.bat  # File thực thi 1-Click dành cho nhân viên kho
├── unified_engine.py                  # Engine xử lý hợp nhất FIFO & SAP
├── index.html                         # Giao diện Web App Sơ đồ kho 2D
├── styles.css                         # System CSS multi-theme
├── app.js                             # Logic ma trận kho, tìm kiếm & bộ lọc
├── data.js / wms_data.json            # Dữ liệu ma trận kho tĩnh
├── HDSD_NHAN_VIEN_KHO.md              # Hướng dẫn sử dụng chi tiết
└── README.md
```

## 🚀 Khởi Chạy
Nhấp đúp vào file `CHAY_HE_THONG_HOP_NHAT_1_CHAM.bat` để khởi chạy toàn bộ quy trình hợp nhất.
