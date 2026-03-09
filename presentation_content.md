# Phân loại hoa dựa trên đặc trưng màu sắc và kết cấu
## Đề tài 2: Sử dụng SVM kết hợp Color Histogram và LBP

---

## 1. Giới thiệu Đề tài
- Phân loại 5 loại hoa phổ biến: Daisy, Dandelion, Rose, Sunflower, Tulip.
- Phương pháp: Sử dụng đặc trưng màu sắc và kết cấu bề mặt ảnh.
- Thuật toán chính: Support Vector Machine (SVM).

---

## 2. Quy trình xử lý ảnh
- **INPUT**: Ảnh màu kích thước bất kỳ.
- **Tiền xử lý**: Resize ảnh về 128x128 pixel.
- **Trích xuất đặc trưng**:
  - **Màu sắc**: Color Histogram (HSV).
  - **Kết cấu**: Local Binary Pattern (LBP).
- **Phân loại**: Huấn luyện và dự đoán bằng SVM.

---

## 3. Đặc trưng Màu sắc (Color Histogram)
- Sử dụng không gian màu **HSV** (Hue, Saturation, Value).
- Phân tách thông tin màu sắc khỏi cường độ sáng.
- Giúp hệ thống ổn định hơn dưới các điều kiện ánh sáng khác nhau.

---

## 4. Đặc trưng Kết cấu (LBP)
- **Local Binary Pattern (LBP)**: Một toán tử mạnh mẽ để mô tả kết cấu bề mặt.
- So sánh giá trị điểm ảnh trung tâm với các điểm lân cận.
- Chuyển đổi kết quả thành mã nhị phân để tạo lược đồ đặc trưng.

---

## 5. Thuật toán SVM (Support Vector Machine)
- Tìm siêu phẳng tối ưu để phân tách các lớp dữ liệu.
- Sử dụng **Kernel RBF** (Radial Basis Function) để xử lý dữ liệu phi tuyến.
- Ưu điểm: Hiệu quả với dữ liệu có số chiều cao.

---

## 6. Kết quả thực nghiệm
- Tổng số mẫu huấn luyện: 1500 ảnh.
- Độ chính xác đạt được: **54.33%**.
- Thời gian xử lý nhanh, phù hợp cho ứng dụng thời gian thực.

---

## 7. Demo sản phẩm
- Hệ thống có khả năng nhận diện chính xác các loại hoa đặc trưng.
- Hiển thị kết quả dự đoán kèm mức độ tin cậy.
- [Hình ảnh kết quả demo sẽ được chèn vào đây]

---

## 8. Kết luận
- Đề tài đã hoàn thành việc xây dựng quy trình phân loại hoa dựa trên SVM.
- Kết hợp đặc trưng màu sắc và kết cấu mang lại hiệu quả tốt hơn so với chỉ dùng một loại đặc trưng.
- Hướng phát triển: Sử dụng Deep Learning (CNN) để nâng cao độ chính xác.
