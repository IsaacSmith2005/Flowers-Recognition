import cv2                     # Thư viện xử lý ảnh OpenCV
import numpy as np             # Thư viện tính toán ma trận
import os                      # Làm việc với file và thư mục
import joblib                  # Lưu và load model machine learning
import matplotlib.pyplot as plt # Vẽ biểu đồ
import seaborn as sns          # Vẽ biểu đồ đẹp hơn (confusion matrix)
from skimage.feature import local_binary_pattern # Trích xuất đặc trưng texture LBP
from sklearn.svm import SVC    # Thuật toán SVM
from sklearn.model_selection import train_test_split # Chia dữ liệu train/test
from sklearn.preprocessing import StandardScaler # Chuẩn hóa dữ liệu
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix # Đánh giá model
from sklearn.utils import shuffle # Trộn dữ liệu
from datetime import datetime  # Lấy ngày hiện tại để lưu file kết quả

# Cấu hình cho LBP (Local Binary Pattern)

METHOD = "uniform"     # Phương pháp LBP uniform
RADIUS = 3             # Bán kính vùng lân cận
N_POINTS = 8 * RADIUS  # Số điểm lân cận dùng để tính LBP

# Lấy ngày hiện tại để đặt tên file kết quả

today = datetime.now().strftime("%Y-%m-%d")

# Tạo thư mục nếu chưa tồn tại

os.makedirs("flower_classification", exist_ok=True)
os.makedirs("results", exist_ok=True)

# Hàm trích xuất đặc trưng màu (Color Histogram)

def extract_color_histogram(image, bins=(8,8,8)):

    # Chuyển ảnh từ BGR sang HSV
    # HSV giúp phân biệt màu sắc tốt hơn RGB
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

    # Tính histogram màu cho 3 kênh HSV
    hist = cv2.calcHist(
        [hsv],          # ảnh đầu vào
        [0,1,2],        # 3 kênh màu
        None,           # không dùng mask
        bins,           # số bin mỗi kênh
        [0,180,0,256,0,256] # phạm vi giá trị HSV
    )

    # Chuẩn hóa histogram
    cv2.normalize(hist,hist)

    # Trả về vector đặc trưng 1 chiều
    return hist.flatten()

# Hàm trích xuất đặc trưng texture bằng LBP

def extract_lbp_features(image):

    # Chuyển ảnh sang grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Tính LBP cho ảnh
    lbp = local_binary_pattern(gray, N_POINTS, RADIUS, METHOD)

    # Tính histogram của giá trị LBP
    hist,_ = np.histogram(
        lbp.flatten(),            # chuyển ảnh LBP thành vector
        bins=np.arange(0,N_POINTS+3), # số bins
        range=(0,N_POINTS+2)
    )

    # Chuyển kiểu dữ liệu sang float
    hist = hist.astype("float")

    # Chuẩn hóa histogram
    hist /= (hist.sum() + 1e-7)

    # Trả về vector đặc trưng texture
    return hist

# Hàm load dataset và trích xuất đặc trưng

def load_data(data_dir, limit_per_class=300):

    # Danh sách lưu đặc trưng và nhãn
    features = []
    labels = []

    # Lấy danh sách các loại hoa (tên thư mục)
    classes = sorted([
        d for d in os.listdir(data_dir)
        if os.path.isdir(os.path.join(data_dir,d))
    ])

    # Duyệt từng loại hoa
    for class_name in classes:

        print(f"Đang xử lý loại hoa: {class_name}...")

        class_path = os.path.join(data_dir,class_name)

        # Lấy danh sách ảnh trong thư mục
        images = [
            f for f in os.listdir(class_path)
            if f.lower().endswith((".jpg",".png",".jpeg"))
        ]

        count = 0

        # Duyệt từng ảnh
        for img_name in images:

            # Giới hạn số ảnh mỗi class
            if count >= limit_per_class:
                break

            img_path = os.path.join(class_path,img_name)

            # Đọc ảnh
            image = cv2.imread(img_path)

            # Nếu ảnh lỗi thì bỏ qua
            if image is None:
                continue

            # Resize ảnh về cùng kích thước
            image = cv2.resize(image,(128,128))

            # Trích xuất đặc trưng màu
            color_feat = extract_color_histogram(image)

            # Trích xuất đặc trưng texture
            texture_feat = extract_lbp_features(image)

            # Ghép 2 đặc trưng thành 1 vector
            feature = np.hstack([color_feat,texture_feat])

            # Lưu feature và label
            features.append(feature)
            labels.append(class_name)

            count += 1

    # Trả về mảng numpy
    return np.array(features), np.array(labels)

# Hàm chính của chương trình
def main():

    # Thư mục dataset
    data_dir = "flower_classification/flowers"

    # Load dữ liệu
    X,y = load_data(data_dir)

    # Trộn dữ liệu để tránh bias
    X,y = shuffle(X,y,random_state=42)

    # Chia dữ liệu train/test
    X_train,X_test,y_train,y_test = train_test_split(
        X,y,
        test_size=0.2,   # 20% test
        random_state=42,
        stratify=y       # giữ tỉ lệ class
    )

    # Chuẩn hóa dữ liệu
    scaler = StandardScaler()

    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    print("Đang huấn luyện SVM...")

    # Khởi tạo mô hình SVM
    model = SVC(
        kernel="rbf",     # kernel phi tuyến
        C=10,             # tham số regularization
        gamma="scale",    # tự động tính gamma
        probability=True  # cho phép dự đoán xác suất
    )

    # Huấn luyện model
    model.fit(X_train,y_train)

    # Dự đoán tập test
    y_pred = model.predict(X_test)

    # Tính accuracy
    acc = accuracy_score(y_test,y_pred)

    print(f"Độ chính xác: {acc*100:.2f}%")

    # In báo cáo chi tiết
    print(classification_report(y_test,y_pred))

    # Lưu model và scaler

    joblib.dump(model,"flower_classification/flower_svm_model.pkl")
    joblib.dump(scaler,"flower_classification/scaler.pkl")

    print("Đã lưu mô hình và scaler.")

    # Vẽ Confusion Matrix

    cm = confusion_matrix(y_test,y_pred)

    plt.figure(figsize=(8,6))

    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        cmap="Blues",
        xticklabels=model.classes_,
        yticklabels=model.classes_
    )

    plt.title("Confusion Matrix")

    # Lưu ảnh confusion matrix
    plt.savefig(f"results/confusion_matrix_{today}.png")

    plt.show()


# Chạy chương trình

if __name__ == "__main__":
    main()