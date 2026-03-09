import { motion } from "framer-motion";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Code2, Copy, Check, ExternalLink } from "lucide-react";

const trainSvmCode = `import cv2                     # Thư viện xử lý ảnh OpenCV
import numpy as np             # Thư viện tính toán ma trận
import os                      # Làm việc với file và thư mục
import joblib                  # Lưu và load model machine learning
import matplotlib.pyplot as plt # Vẽ biểu đồ
import seaborn as sns          # Vẽ biểu đồ đẹp hơn (confusion matrix)
from skimage.feature import local_binary_pattern # Trích xuất đặc trưng texture LBP
from sklearn.svm import SVC    # Thuật toán SVM
from sklearn.model_selection import train_test_split # Chia dữ liệu train/test
from sklearn.preprocessing import StandardScaler # Chuẩn hóa dữ liệu
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from sklearn.utils import shuffle # Trộn dữ liệu
from datetime import datetime

# Cấu hình cho LBP (Local Binary Pattern)
METHOD = "uniform"     # Phương pháp LBP uniform
RADIUS = 3             # Bán kính vùng lân cận
N_POINTS = 8 * RADIUS  # Số điểm lân cận dùng để tính LBP

today = datetime.now().strftime("%Y-%m-%d")
os.makedirs("flower_classification", exist_ok=True)
os.makedirs("results", exist_ok=True)

# Hàm trích xuất đặc trưng màu (Color Histogram)
def extract_color_histogram(image, bins=(8,8,8)):
    # Chuyển ảnh từ BGR sang HSV
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    # Tính histogram màu cho 3 kênh HSV
    hist = cv2.calcHist(
        [hsv], [0,1,2], None, bins,
        [0,180,0,256,0,256]
    )
    cv2.normalize(hist, hist)
    return hist.flatten()

# Hàm trích xuất đặc trưng texture bằng LBP
def extract_lbp_features(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    lbp = local_binary_pattern(gray, N_POINTS, RADIUS, METHOD)
    hist, _ = np.histogram(
        lbp.flatten(),
        bins=np.arange(0, N_POINTS+3),
        range=(0, N_POINTS+2)
    )
    hist = hist.astype("float")
    hist /= (hist.sum() + 1e-7)
    return hist

# Hàm load dataset và trích xuất đặc trưng
def load_data(data_dir, limit_per_class=300):
    features = []
    labels = []
    classes = sorted([
        d for d in os.listdir(data_dir)
        if os.path.isdir(os.path.join(data_dir, d))
    ])
    for class_name in classes:
        print(f"Đang xử lý loại hoa: {class_name}...")
        class_path = os.path.join(data_dir, class_name)
        images = [
            f for f in os.listdir(class_path)
            if f.lower().endswith((".jpg",".png",".jpeg"))
        ]
        count = 0
        for img_name in images:
            if count >= limit_per_class:
                break
            img_path = os.path.join(class_path, img_name)
            image = cv2.imread(img_path)
            if image is None:
                continue
            image = cv2.resize(image, (128,128))
            color_feat = extract_color_histogram(image)
            texture_feat = extract_lbp_features(image)
            feature = np.hstack([color_feat, texture_feat])
            features.append(feature)
            labels.append(class_name)
            count += 1
    return np.array(features), np.array(labels)

# Hàm chính
def main():
    data_dir = "flower_classification/flowers"
    X, y = load_data(data_dir)
    X, y = shuffle(X, y, random_state=42)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    print("Đang huấn luyện SVM...")
    model = SVC(
        kernel="rbf", C=10, gamma="scale", probability=True
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Độ chính xác: {acc*100:.2f}%")
    print(classification_report(y_test, y_pred))

    joblib.dump(model, "flower_classification/flower_svm_model.pkl")
    joblib.dump(scaler, "flower_classification/scaler.pkl")

    # Vẽ Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(8,6))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
                xticklabels=model.classes_,
                yticklabels=model.classes_)
    plt.title("Confusion Matrix")
    plt.savefig(f"results/confusion_matrix_{today}.png")
    plt.show()

if __name__ == "__main__":
    main()`;

const demoPredictCode = `import cv2
import numpy as np
import os
import joblib
import random
import matplotlib.pyplot as plt
from skimage.feature import local_binary_pattern
from datetime import datetime

METHOD = "uniform"
RADIUS = 3
N_POINTS = 8 * RADIUS
today = datetime.now().strftime("%Y-%m-%d")
os.makedirs("results", exist_ok=True)

# Hàm trích xuất đặc trưng màu (Color Histogram)
def extract_color_histogram(image):
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    hist = cv2.calcHist(
        [hsv], [0,1,2], None, (8,8,8),
        [0,180,0,256,0,256]
    )
    cv2.normalize(hist, hist)
    return hist.flatten()

# Hàm trích xuất đặc trưng texture bằng LBP
def extract_lbp_features(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    lbp = local_binary_pattern(gray, N_POINTS, RADIUS, METHOD)
    hist, _ = np.histogram(
        lbp.flatten(),
        bins=np.arange(0, N_POINTS+3),
        range=(0, N_POINTS+2)
    )
    hist = hist.astype("float")
    hist /= (hist.sum() + 1e-7)
    return hist

# Hàm dự đoán loại hoa từ một ảnh
def predict_flower(image_path, model, scaler):
    image = cv2.imread(image_path)
    if image is None:
        return None, None, None
    orig = image.copy()
    image = cv2.resize(image, (128,128))
    color = extract_color_histogram(image)
    texture = extract_lbp_features(image)
    feature = np.hstack([color, texture]).reshape(1,-1)
    feature = scaler.transform(feature)
    pred = model.predict(feature)[0]
    prob = model.predict_proba(feature)[0]
    confidence = np.max(prob)
    return pred, confidence, orig

# Hàm chính
def main():
    model = joblib.load("flower_classification/flower_svm_model.pkl")
    scaler = joblib.load("flower_classification/scaler.pkl")
    data_dir = "flower_classification/flowers"

    classes = sorted([
        d for d in os.listdir(data_dir)
        if os.path.isdir(os.path.join(data_dir, d))
    ])

    test_images = []
    for class_name in classes:
        class_path = os.path.join(data_dir, class_name)
        imgs = [
            f for f in os.listdir(class_path)
            if f.lower().endswith((".jpg",".png",".jpeg"))
        ]
        if imgs:
            img = random.choice(imgs)
            test_images.append(os.path.join(class_path, img))

    plt.figure(figsize=(15,10))
    for i, img_path in enumerate(test_images[:6]):
        pred, prob, img = predict_flower(img_path, model, scaler)
        if pred is None:
            continue
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        plt.subplot(2,3,i+1)
        plt.imshow(img_rgb)
        actual = os.path.basename(os.path.dirname(img_path))
        color = "green" if pred == actual else "red"
        plt.title(
            f"Thực tế: {actual}\\nDự đoán: {pred}\\nTin cậy: {prob*100:.1f}%",
            color=color
        )
        plt.axis("off")

    plt.tight_layout()
    save_path = f"results/demo_results_{today}.png"
    plt.savefig(save_path)
    print(f"Đã lưu kết quả tại: {save_path}")
    plt.show()

if __name__ == "__main__":
    main()`;

const tabs = [
  { id: "train", label: "train_svm.py", desc: "Huấn luyện mô hình SVM", code: trainSvmCode },
  { id: "demo", label: "demo_predict.py", desc: "Dự đoán loại hoa", code: demoPredictCode },
];

const SourceCodeSection = () => {
  const [activeTab, setActiveTab] = useState("train");
  const [copied, setCopied] = useState(false);

  const activeFile = tabs.find((t) => t.id === activeTab)!;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="source-code" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Mã nguồn Python
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-body">
            Toàn bộ source code xử lý ảnh, trích xuất đặc trưng và huấn luyện SVM
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          {/* Tab bar */}
          <div className="flex items-center justify-between bg-card rounded-t-2xl border border-border border-b-0 px-4 py-2">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Code2 className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Đã copy" : "Copy"}
              </button>
              <a
                href="https://github.com/IsaacSmith2005/Flowers-Recognition"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                GitHub
              </a>
            </div>
          </div>

          {/* File description */}
          <div className="bg-card border-x border-border px-4 py-2">
            <p className="text-sm text-muted-foreground font-body">
              📄 <span className="font-semibold text-foreground">{activeFile.label}</span> — {activeFile.desc}
            </p>
          </div>

          {/* Code block */}
          <div className="rounded-b-2xl overflow-hidden border border-border border-t-0">
            <SyntaxHighlighter
              language="python"
              style={oneDark}
              showLineNumbers
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: "0.85rem",
                maxHeight: "600px",
              }}
              lineNumberStyle={{ opacity: 0.4, minWidth: "3em" }}
            >
              {activeFile.code}
            </SyntaxHighlighter>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SourceCodeSection;
