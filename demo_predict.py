import cv2                      # Thư viện xử lý ảnh OpenCV
import numpy as np              # Thư viện tính toán ma trận
import os                       # Làm việc với file và thư mục
import joblib                   # Load model đã huấn luyện
import random                   # Chọn ảnh ngẫu nhiên
import matplotlib.pyplot as plt # Hiển thị và lưu ảnh kết quả
from skimage.feature import local_binary_pattern # Trích xuất đặc trưng texture LBP
from datetime import datetime   # Lấy ngày hiện tại để đặt tên file


# Cấu hình tham số cho thuật toán LBP
METHOD = "uniform"      # Phương pháp LBP uniform
RADIUS = 3              # Bán kính vùng lân cận
N_POINTS = 8 * RADIUS   # Số điểm lân cận

# Lấy ngày hiện tại để lưu file kết quả
today = datetime.now().strftime("%Y-%m-%d")

# Tạo thư mục lưu kết quả nếu chưa tồn tại

os.makedirs("results",exist_ok=True)

# Hàm trích xuất đặc trưng màu (Color Histogram)

def extract_color_histogram(image):

    # Chuyển ảnh từ BGR sang HSV
    # HSV giúp phân tích màu sắc tốt hơn RGB
    hsv = cv2.cvtColor(image,cv2.COLOR_BGR2HSV)

    # Tính histogram màu cho 3 kênh HSV
    hist = cv2.calcHist(
        [hsv],              # ảnh đầu vào
        [0,1,2],            # 3 kênh màu
        None,               # không dùng mask
        (8,8,8),            # số bins cho mỗi kênh
        [0,180,0,256,0,256] # phạm vi giá trị HSV
    )

    # Chuẩn hóa histogram
    cv2.normalize(hist,hist)

    # Chuyển histogram thành vector 1 chiều
    return hist.flatten()

# Hàm trích xuất đặc trưng texture bằng LBP

def extract_lbp_features(image):

    # Chuyển ảnh sang grayscale
    gray = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)

    # Tính LBP cho ảnh
    lbp = local_binary_pattern(gray,N_POINTS,RADIUS,METHOD)

    # Tính histogram của các giá trị LBP
    hist,_ = np.histogram(
        lbp.flatten(),              # chuyển ảnh thành vector
        bins=np.arange(0,N_POINTS+3),
        range=(0,N_POINTS+2)
    )

    # Chuyển kiểu dữ liệu sang float
    hist = hist.astype("float")

    # Chuẩn hóa histogram
    hist /= (hist.sum()+1e-7)

    # Trả về vector đặc trưng texture
    return hist

# Hàm dự đoán loại hoa từ một ảnh

def predict_flower(image_path,model,scaler):

    # Đọc ảnh từ đường dẫn
    image = cv2.imread(image_path)

    # Nếu ảnh lỗi thì bỏ qua
    if image is None:
        return None,None,None

    # Lưu lại ảnh gốc để hiển thị
    orig = image.copy()

    # Resize ảnh về kích thước chuẩn
    image = cv2.resize(image,(128,128))

    # Trích xuất đặc trưng màu
    color = extract_color_histogram(image)

    # Trích xuất đặc trưng texture
    texture = extract_lbp_features(image)

    # Ghép 2 loại đặc trưng thành 1 vector
    feature = np.hstack([color,texture]).reshape(1,-1)

    # Chuẩn hóa đặc trưng bằng scaler đã train
    feature = scaler.transform(feature)

    # Dự đoán loại hoa
    pred = model.predict(feature)[0]

    # Lấy xác suất dự đoán
    prob = model.predict_proba(feature)[0]

    # Lấy giá trị xác suất cao nhất
    confidence = np.max(prob)

    # Trả về:
    # loại hoa dự đoán
    # độ tin cậy
    # ảnh gốc
    return pred,confidence,orig

# Hàm chính của chương trình

def main():

    # Load model SVM đã huấn luyện
    model = joblib.load("flower_classification/flower_svm_model.pkl")

    # Load scaler đã dùng để chuẩn hóa dữ liệu
    scaler = joblib.load("flower_classification/scaler.pkl")

    # Thư mục chứa dataset
    data_dir = "flower_classification/flowers"

    # Lấy danh sách các loại hoa
    classes = sorted([
        d for d in os.listdir(data_dir)
        if os.path.isdir(os.path.join(data_dir,d))
    ])

    test_images = []

    # Chọn ngẫu nhiên 1 ảnh từ mỗi loại hoa
    for class_name in classes:

        class_path = os.path.join(data_dir,class_name)

        imgs = [
            f for f in os.listdir(class_path)
            if f.lower().endswith((".jpg",".png",".jpeg"))
        ]

        if imgs:
            img = random.choice(imgs)
            test_images.append(os.path.join(class_path,img))

    # Tạo figure hiển thị kết quả
    plt.figure(figsize=(15,10))

    # Duyệt các ảnh test
    for i,img_path in enumerate(test_images[:6]):

        # Dự đoán loại hoa
        pred,prob,img = predict_flower(img_path,model,scaler)

        if pred is None:
            continue

        # Chuyển ảnh sang RGB để hiển thị đúng màu
        img_rgb = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)

        plt.subplot(2,3,i+1)

        plt.imshow(img_rgb)

        # Lấy nhãn thật từ tên thư mục
        actual = os.path.basename(os.path.dirname(img_path))

        # Màu tiêu đề: xanh nếu đúng, đỏ nếu sai
        color = "green" if pred==actual else "red"

        # Hiển thị thông tin dự đoán
        plt.title(
            f"Thực tế: {actual}\n"
            f"Dự đoán: {pred}\n"
            f"Tin cậy: {prob*100:.1f}%",
            color=color
        )

        plt.axis("off")

    # Căn chỉnh layout
    plt.tight_layout()

    # Đường dẫn lưu kết quả
    save_path = f"results/demo_results_{today}.png"

    # Lưu ảnh demo
    plt.savefig(save_path)

    print(f"Đã lưu kết quả tại: {save_path}")

    # Hiển thị kết quả
    plt.show()

# Chạy chương trình

if __name__ == "__main__":
    main()