# Automatic FIFO Inventory Deduction System

Hệ thống Phân bổ Xuất kho & Trừ Tồn Kho Tự Động theo Nguyên tắc FIFO (First-In, First-Out).

## 🌟 Tính Năng Nổi Bật
- **Phân Bổ FIFO Chuẩn Xác 100%**: Ưu tiên nhặt các Lô hàng có Hạn Sử Dụng (NSX) hoặc Ngày Nhập Kho cũ nhất trước.
- **Tự Động Xuất Báo Cáo Excel**: Xuất Phiếu nhặt hàng chi tiết và số dư tồn kho còn lại cho các đơn hàng tiếp theo.
- **Vận Hành 1-Click**: Thực thi qua `CHAY_FIFO_1_CHAM.bat`.

## 📁 Cấu Trúc Dự Án
```
QUAN_LY_KHO_FIFO/
├── CHAY_FIFO_1_CHAM.bat       # Script thực thi 1-chạm
├── CHUAN_BI_DU_LIEU.xlsx      # File dữ liệu đầu vào (Nhu cầu xuất & Tồn kho)
├── scripts/
│   └── process_fifo_qr.py     # Engine tính toán phân bổ FIFO
├── KET_QUA_XUAT_KHO/
│   └── KET_QUA_MOI_NHAT.xlsx  # File kết quả nhặt hàng & tồn kho còn lại
└── README.md
```

## 🚀 Khởi Chạy
Nhấp đúp chuột vào file `CHAY_FIFO_1_CHAM.bat` để chạy quy trình phân bổ FIFO.
