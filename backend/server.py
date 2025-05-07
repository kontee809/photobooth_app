# app.py
import os
import io
import time
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import onnxruntime as ort

# === Cấu hình ===
PIC_EXT = ['.jpeg','.jpg','.png','.JPEG','.JPG','.PNG']
MODEL_NAME = 'AnimeGANv3_Hayao_STYLE_36'
MAX_DIM = 1024  # giới hạn kích thước để tiết kiệm memory
ONNX_PATH = f'{MODEL_NAME}.onnx'

# Khởi tạo Flask
app = Flask(__name__)
CORS(app)  # Cho phép CORS từ frontend

# Khởi tạo session ONNXRuntime
session = ort.InferenceSession(ONNX_PATH, providers=['CPUExecutionProvider'])

def process_image(img: np.ndarray, x8: bool = True) -> np.ndarray:
    """ Tiền xử lý ảnh: resize, crop cho chia hết 8, normalize """
    h, w = img.shape[:2]
    # resize nếu quá lớn
    if max(h, w) > MAX_DIM:
        scale = MAX_DIM / max(h, w)
        new_h, new_w = int(h * scale), int(w * scale)
        img = cv2.resize(img, (new_w, new_h))
        print(f"Resized image from {w}x{h} to {new_w}x{new_h}")
    h, w = img.shape[:2]
    if x8:
        def to_8s(x): return 256 if x < 256 else x - x % 8
        img = cv2.resize(img, (to_8s(w), to_8s(h)))
    # BGR → RGB, scale về [-1,1]
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB).astype(np.float32) / 127.5 - 1.0
    return img

def convert_numpy_to_anime(img_np: np.ndarray, orig_shape: tuple) -> np.ndarray:
    """
    Chạy inference và resize về lại kích thước gốc.
    - img_np: shape (1,H,W,3), normalized
    - orig_shape: (h, w)
    """
    in_name = session.get_inputs()[0].name
    fake = session.run(None, {in_name: img_np})[0]  # shape (1, H, W, 3)
    img = np.squeeze(fake)  # (H,W,3), vẫn RGB, trong [-1,1]
    img = (img + 1.) / 2 * 255
    img = np.clip(img, 0, 255).astype(np.uint8)
    # resize về kích thước gốc
    out = cv2.resize(img, (orig_shape[1], orig_shape[0]))
    return cv2.cvtColor(out, cv2.COLOR_RGB2BGR)

def decode_base64_image(data_url: str) -> np.ndarray:
    """ Giải mã từ Data URL (data:image/jpeg;base64,...) về numpy array BGR """
    header, encoded = data_url.split(',', 1)
    data = base64.b64decode(encoded)
    buf = np.frombuffer(data, dtype=np.uint8)
    img = cv2.imdecode(buf, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Invalid image")
    return img

def encode_image_to_base64(img: np.ndarray) -> str:
    """ Mã hóa numpy BGR image → Data URL JPEG """
    success, buffer = cv2.imencode('.jpg', img)
    if not success:
        raise ValueError("Failed to encode image")
    encoded = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/jpeg;base64,{encoded}"

@app.route('/process', methods=['POST'])
def process_route():
    data = request.get_json(force=True)
    images = data.get('images', [])
    if not images or not isinstance(images, list):
        return jsonify(status="error", message="Yêu cầu phải có danh sách 'images'"), 400
    results = []
    start_all = time.time()
    for idx, data_url in enumerate(images):
        try:
            # 1) decode
            img0 = decode_base64_image(data_url)
            orig_shape = img0.shape[:2]
            # 2) tiền xử lý
            img_proc = process_image(img0)           # RGB normalized shape (H',W',3)
            img_proc = np.expand_dims(img_proc, axis=0)  # (1,H',W',3)
            # 3) inference & convert
            out_bgr = convert_numpy_to_anime(img_proc, orig_shape)
            # 4) encode
            results.append(encode_image_to_base64(out_bgr))
            print(f"[{idx+1}/{len(images)}] processed in {time.time() - start_all:.2f}s")
        except Exception as e:
            print(f"Error processing image {idx}: {e}")
            return jsonify(status="error", message=str(e)), 500

    total_time = time.time() - start_all
    print(f"All done in {total_time:.2f}s")
    return jsonify(status="success", results=results)

if __name__ == '__main__':
    # Chạy develop: host=0.0.0.0 để frontend có thể truy cập
    app.run(host='0.0.0.0', port=5000, debug=True)
