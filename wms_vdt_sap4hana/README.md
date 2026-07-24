# WMS VĐT - SAP S/4HANA Dynamic Warehouse System

Hệ thống Quản lý Kho Động 4,032 Vị trí chuẩn SAP S/4HANA & Vùng Đệm Sàn (TW / VW / VL).

## 🌟 Tính Năng Nổi Bật
- **Sơ Đồ Ma Trận Kho 2D Trực Quan**: 4,032 ô kệ cao tầng (Dãy A-H) + 6 Khu Vực Đệm Trung Chuyển Sàn.
- **Tự Động Bóc Tách Đa Đơn Vị Tính (Multi-Unit Breakdown)**: Phân loại minh bạch `Kg`, `Thùng`, `Cái`, `Cuộn`, `Met`, `Bộ`, `Đôi`, `Chai`, `Vắt`...
- **Chế Độ Giao Diện Kép**: ☀️ Light Mode (Sáng công sở) / 🌙 Dark Mode (Tối hiện đại).
- **Vận Hành 1-Click**: Khởi chạy bằng `MO_HE_THONG_KHO_VDT.bat`.

## 📁 Cấu Trúc Dự Án
```
wms_vdt_sap4hana/
├── MO_HE_THONG_KHO_VDT.bat    # File thực thi 1-Click dành cho nhân viên kho
├── wms_engine.py              # Engine map mã vị trí SAP & xử lý dữ liệu
├── index.html                 # Giao diện Web App Sơ đồ kho 2D
├── styles.css                 # Hệ thống thiết kế CSS multi-theme
├── app.js                     # Logic hiển thị ma trận, tìm kiếm & bộ lọc
├── data.js / wms_data.json    # Dữ liệu ma trận kho tĩnh (không lo CORS)
├── HDSD_NHAN_VIEN_KHO.md      # Hướng dẫn sử dụng chi tiết từng bước
└── README.md
```

## 🚀 Khởi Chạy
Nhấp đúp vào file `MO_HE_THONG_KHO_VDT.bat` để chạy hệ thống.
