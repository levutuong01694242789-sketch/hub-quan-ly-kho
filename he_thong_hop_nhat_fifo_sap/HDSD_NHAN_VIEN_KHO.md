# 📋 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG KHO ĐỘNG SAP S/4HANA (WMS VĐT)
*(Dành cho Nhân viên & Công nhân Kho - Rất đơn giản, không cần trình độ công nghệ)*

---

## 🌟 GIỚI THIỆU CHUNG
Hệ thống Kho Động **WMS VĐT - SAP S/4HANA** giúp bạn:
1. **Tự động quy đổi và chuẩn hóa** mã vị trí kho cũ (vd: `A1-1-1`, `E1-1-01`) sang **Mã vị trí mới chuẩn SAP S/4HANA** (vd: `VDT-A-1-01-N`, `VDT-E-1-01-N`).
2. **Tự động trừ tồn kho theo từng ô vị trí & số Pallet** dựa theo kết quả xuất kho FIFO.
3. **Xem Sơ đồ Kho Trực quan 2D** bằng màu sắc đơn giản (🟢 **Xanh**: Ô trống, 🔴 **Đỏ**: Ô đang có hàng, 🟡 **Vàng**: Vị trí tìm kiếm).

---

## 🚀 THAO TÁC 3-BƯỚC HÀNG NGÀY (CHỈ CẦN 1 PHÚT)

### 📌 Bước 1: Mở Hệ Thống
1. Tìm biểu tượng **`MO_HE_THONG_KHO_VDT.bat`** trên Màn hình (Desktop).
2. **Nhấp đúp chuột trái 2 lần** vào tệp này.
3. Trình duyệt máy tính sẽ tự động mở giao diện Kho Động VĐT.

---

### 📌 Bước 2: Nạp File FIFO & Trừ Kho Tự Động

| Bước | Thao tác trên màn hình | Mô tả |
| :---: | :--- | :--- |
| **BƯỚC 1** | Bấm nút **`[1. Chọn File Excel...]`** | Chọn file xuất kho FIFO của bạn (tên tệp: `KET_QUA_MOI_NHAT.xlsx`). |
| **BƯỚC 2** | Bấm nút **`[2. Thực Hiện Trừ Kho]`** | Hệ thống tự động khấu trừ số lượng Pallet và cập nhật mã vị trí chuẩn SAP. |
| **BƯỚC 3** | Bấm nút **`[3. Tải Báo Cáo Excel SAP]`** | Máy tính tự động tải file báo cáo đã chuẩn hóa vị trí SAP mới về máy. |

---

## 🔍 CÁCH XEM SƠ ĐỒ KHO & TRA CỨU VỊ TRÍ HÀNG

### 1. Phối Màu Trạng Thái Ô Kho:
- 🟢 **Màu Xanh Lá**: Ô trống hoàn toàn (100% khả dụng để xếp hàng mới vào).
- 🔴 **Màu Đỏ**: Ô đang chứa Pallet tồn kho.
- 🔵 **Thẻ [T] (Màu Xanh Dương)**: Vị trí **Phía Trong (Double-Deep)**. Khi xuất hàng, lưu ý kiểm tra ô **[N] (Phía Ngoài)** có bị chặn hay không.

### 2. Tra Cứu Nhanh Ô Kho hoặc Mã Hàng:
- Nhập thông tin vào ô tìm kiếm ở đầu trang:
  - Nhập **Mã Hàng** (vd: `B0006`, `B0252`...).
  - Hoặc nhập **Số Pallet** (vd: `KMS010371`...).
  - Hoặc nhập **Mã vị trí** (vd: `A1-1-1` hoặc `VDT-A-1-01-N`).
- Các ô kho phù hợp sẽ lập tức **nổi bật viền vàng chớp sáng** để bạn dễ dàng tìm thấy trên ma trận kho.

### 3. Xem Chi Tiết Tồn Kho Của 1 Ô Vị Trí:
- Chỉ cần **nhấp chuột trái vào ô vị trí đó trên sơ đồ**.
- Màn hình sẽ hiện ra bảng chi tiết: Mã vị trí mới chuẩn SAP, Dãy, Tầng, Loại vị trí (Trong/Ngoài), Danh sách các Pallet đang lưu trữ, Mã hàng, Số lượng (Kg) và Hạn sử dụng.

---

## ❓ GIẢI ĐÁP THẮC MẮC THƯỜNG GẶP (FAQ)

1. **Hỏi: Tôi không rành máy tính thì có sợ bấm nhầm làm mất dữ liệu không?**
   - **Đáp**: Không hề! Hệ thống được thiết kế an toàn 100%. Mọi dữ liệu gốc đều được giữ nguyên.

2. **Hỏi: Khi lấy hàng ở vị trí [T] (Phía Trong) thì cần chú ý điều gì?**
   - **Đáp**: Ô `[T]` là vị trí xếp hàng sâu phía trong. Hãy ưu tiên lấy ô `[N]` (Phía ngoài) trước để tránh tốn thời gian đảo xe nâng.

3. **Hỏi: Nếu file báo lỗi không đúng định dạng thì làm sao?**
   - **Đáp**: Đảm bảo file nạp vào ở Bước 1 là file kết quả FIFO chuẩn (định dạng `.xlsx`). Nếu cần hỗ trợ, bạn chỉ cần liên hệ bộ phận IT hoặc quản lý kho.

---

*Chúc anh chị em nhân viên kho VĐT vận hành kho chính xác và thuận tiện!*
