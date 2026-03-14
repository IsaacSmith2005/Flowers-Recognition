import cv2
import numpy as np
import os
import joblib
import random
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from skimage.feature import local_binary_pattern

app = Flask(__name__)
CORS(app)

# Cấu hình tham số cho thuật toán LBP
METHOD = "uniform"
RADIUS = 3
N_POINTS = 8 * RADIUS

# Load model và scaler
MODEL_PATH = "flower_classification/flower_svm_model.pkl"
SCALER_PATH = "flower_classification/scaler.pkl"
CLASS_NAMES_PATH = "flower_classification/class_names.pkl"
DATASET_PATH = "flower_classification/flowers"

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
class_names = joblib.load(CLASS_NAMES_PATH)

def extract_color_histogram(image):
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    hist = cv2.calcHist([hsv], [0, 1, 2], None, (8, 8, 8), [0, 180, 0, 256, 0, 256])
    cv2.normalize(hist, hist)
    return hist.flatten()

def extract_lbp_features(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    lbp = local_binary_pattern(gray, N_POINTS, RADIUS, METHOD)
    hist, _ = np.histogram(lbp.flatten(), bins=np.arange(0, N_POINTS + 3), range=(0, N_POINTS + 2))
    hist = hist.astype("float")
    hist /= (hist.sum() + 1e-7)
    return hist

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    file_bytes = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if image is None:
        return jsonify({"error": "Invalid image file"}), 400

    image_resized = cv2.resize(image, (128, 128))
    color = extract_color_histogram(image_resized)
    texture = extract_lbp_features(image_resized)
    feature = np.hstack([color, texture]).reshape(1, -1)
    feature = scaler.transform(feature)

    pred = model.predict(feature)[0]
    prob = model.predict_proba(feature)[0]
    confidence = float(np.max(prob))

    return jsonify({
        "name": pred.capitalize(),
        "confidence": confidence * 100
    })

@app.route("/random_flowers", methods=["GET"])
def random_flowers():
    # Lấy số lượng ảnh cần lấy (mặc định là 5)
    count = int(request.args.get('count', 5))
    
    classes = [d for d in os.listdir(DATASET_PATH) if os.path.isdir(os.path.join(DATASET_PATH, d))]
    if not classes:
        return jsonify({"error": "Dataset not found"}), 404
    
    results = []
    
    for _ in range(count):
        actual_class = random.choice(classes)
        class_path = os.path.join(DATASET_PATH, actual_class)
        
        images = [f for f in os.listdir(class_path) if f.lower().endswith((".jpg", ".png", ".jpeg"))]
        if not images:
            continue
            
        img_name = random.choice(images)
        img_path = os.path.join(class_path, img_name)
        
        with open(img_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            img_type = img_name.split('.')[-1]
            data_url = f"data:image/{img_type};base64,{encoded_string}"
            
            results.append({
                "actual_name": actual_class.capitalize(),
                "image_data": data_url
            })
    
    return jsonify(results)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
