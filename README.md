# 🌸 Flower Recognition System

Hệ thống nhận diện và phân loại hoa sử dụng thuật toán SVM (Support Vector Machine) kết hợp với các kỹ thuật trích xuất đặc trưng hình ảnh tiên tiến.

## 📖 Giới thiệu đề tài

Đề tài này xây dựng một hệ thống tự động nhận diện các loại hoa khác nhau dựa trên hình ảnh. Hệ thống sử dụng:
- **SVM Classifier** cho việc phân loại
- **Color Histogram** (không gian màu HSV) để trích xuất đặc trưng màu sắc
- **Local Binary Pattern (LBP)** để trích xuất đặc trưng texture (kết cấu bề mặt)
- **Web Interface** xây dựng bằng React + TypeScript cho trải nghiệm người dùng hiện đại

### 🎯 Mục tiêu
- Phân loại 5 loại hoa phổ biến: **Daisy, Dandelion, Rose, Sunflower, Tulip**
- Xây dựng quy trình xử lý ảnh hoàn chỉnh từ input đến output
- Đánh giá hiệu quả của phương pháp kết hợp đặc trưng màu sắc và kết cấu

## 👥 Nhóm thực hiện

| Thành viên | Vai trò | Công việc chính |
|------------|--------|-----------------|
| **Rmah Viu** | Team Lead & ML Engineer | • Phát triển thuật toán SVM<br>• Tối ưu hóa model và hyperparameter tuning<br>• Nghiên cứu và implement LBP features |
| **Phan Thanh Huy** | Backend & Data Engineer | • Xử lý và chuẩn bị dataset<br>• Implement feature extraction (Color Histogram)<br>• Xây dựng pipeline huấn luyện model |
| **Nguyễn Thanh Phước** | Frontend & DevOps Engineer | • Phát triển web interface (React + TypeScript)<br>• Tích hợp model với frontend<br>• Deploy và quản lý hệ thống |

## 🚀 Hướng dẫn cài đặt và chạy

### Yêu cầu hệ thống
- Python 3.8+
- Node.js 16+
- Git

### Cách 1: Chạy Demo Console

1. **Clone repository**
```bash
git clone https://github.com/IsaacSmith2005/Flowers-Recognition.git
cd Flowers-Recognition
```

2. **Cài đặt thư viện Python**
```bash
python -m pip install opencv-python numpy scikit-learn joblib matplotlib scikit-image
```

3. **Chạy chương trình demo**
```bash
python demo_predict.py
```

Kết quả sẽ được lưu trong thư mục `results/` với tên `demo_results_YYYY-MM-DD.png`

### Cách 2: Chạy Web Interface

1. **Di chuyển vào thư mục web**
```bash
cd petal-perception-main
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Khởi động development server**
```bash
npm run dev
```

4. **Mở trình duyệt**
Truy cập `http://localhost:5173`

## 📁 Cấu trúc project

```
Flowers-Recognition/
├── demo_predict.py              # Demo console application
├── train_svm.py                 # Script huấn luyện model
├── flower_classification/       # Model và scaler đã train
│   ├── flower_svm_model.pkl     # SVM model
│   ├── scaler.pkl               # StandardScaler
│   └── flowers/                 # Dataset
├── results/                     # Kết quả demo
├── petal-perception-main/       # Web application
│   ├── src/                     # React source code
│   ├── package.json             # Dependencies
│   └── public/                  # Static assets
└── README.md                    # File này
```

## 🔬 Kỹ thuật sử dụng

### 📋 Quy trình xử lý ảnh
1. **INPUT**: Ảnh màu kích thước bất kỳ
2. **Tiền xử lý**: Resize ảnh về 128x128 pixel
3. **Trích xuất đặc trưng**:
   - **Màu sắc**: Color Histogram (HSV)
   - **Kết cấu**: Local Binary Pattern (LBP)
4. **Phân loại**: Huấn luyện và dự đoán bằng SVM

### 🎨 Đặc trưng Màu sắc (Color Histogram)
- Sử dụng không gian màu **HSV** (Hue, Saturation, Value)
- Phân tách thông tin màu sắc khỏi cường độ sáng
- Giúp hệ thống ổn định hơn dưới các điều kiện ánh sáng khác nhau
- Phân tích histogram trong không gian HSV (8x8x8 bins)

### 🧩 Đặc trưng Kết cấu (LBP)
- **Local Binary Pattern (LBP)**: Toán tử mạnh mẽ để mô tả kết cấu bề mặt
- So sánh giá trị điểm ảnh trung tâm với các điểm lân cận
- Chuyển đổi kết quả thành mã nhị phân để tạo lược đồ đặc trưng
- Trích xuất đặc trưng texture với radius=3, points=24

### 🤖 Thuật toán SVM (Support Vector Machine)
- Tìm siêu phẳng tối ưu để phân tách các lớp dữ liệu
- Sử dụng **Kernel RBF** (Radial Basis Function) để xử lý dữ liệu phi tuyến
- Ưu điểm: Hiệu quả với dữ liệu có số chiều cao
- Input: Vector đặc trưng kết hợp (màu + texture)
- Output: Phân loại 5 loại hoa với độ tin cậy

## 📊 Kết quả thực nghiệm

### 📈 Thống kê huấn luyện
- **Tổng số mẫu huấn luyện**: 1500 ảnh
- **Số lớp phân loại**: 5 loại hoa (Daisy, Dandelion, Rose, Sunflower, Tulip)
- **Độ chính xác đạt được**: **54.33%**
- **Thời gian xử lý**: <0.5s per image
- **Định dạng hỗ trợ**: JPG, PNG, JPEG

### 🎯 Demo sản phẩm
- Hệ thống có khả năng nhận diện chính xác các loại hoa đặc trưng
- Hiển thị kết quả dự đoán kèm mức độ tin cậy
- Kết quả được lưu trong thư mục `results/` với tên `demo_results_YYYY-MM-DD.png`

### 🔮 Kết luận và Hướng phát triển
- ✅ Đề tài đã hoàn thành việc xây dựng quy trình phân loại hoa dựa trên SVM
- ✅ Kết hợp đặc trưng màu sắc và kết cấu mang lại hiệu quả tốt hơn so với chỉ dùng một loại đặc trưng
- 🚀 **Hướng phát triển**: Sử dụng Deep Learning (CNN) để nâng cao độ chính xác

## 🛠️ Công nghệ

### Backend
- Python 3.8+
- OpenCV (Computer Vision)
- Scikit-learn (Machine Learning)
- NumPy (Numerical Computing)
- Scikit-image (Image Processing)

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Radix UI Components
- Framer Motion

## 📝 Tài liệu tham khảo

- [SVM Documentation](https://scikit-learn.org/stable/modules/svm.html)
- [OpenCV Python Tutorials](https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html)
- [LBP Feature Extraction](https://scikit-image.org/docs/dev/auto_examples/features_detection/plot_local_binary_pattern.html)
