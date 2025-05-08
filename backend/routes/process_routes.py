from flask import Blueprint, request, jsonify
import time, base64
import numpy as np
import cv2
import onnxruntime as ort
from utils.image_utils import decode_base64_image, encode_image_to_base64, process_image, convert_numpy_to_anime

process_bp = Blueprint('process', __name__)

MODEL_NAME = 'AnimeGANv3_Hayao_STYLE_36'
MAX_DIM = 1024
ONNX_PATH = f'{MODEL_NAME}.onnx'

session = ort.InferenceSession(ONNX_PATH, providers=['CPUExecutionProvider'])

@process_bp.route('/process', methods=['POST'])
def process_image_route():
    data = request.get_json(force=True)
    images = data.get('images', [])
    if not images or not isinstance(images, list):
        return jsonify(status="error", message="Yêu cầu phải có danh sách 'images'"), 400

    results = []
    start_all = time.time()
    for idx, data_url in enumerate(images):
        try:
            img0 = decode_base64_image(data_url)
            orig_shape = img0.shape[:2]
            img_proc = process_image(img0)
            img_proc = np.expand_dims(img_proc, axis=0)
            out_bgr = convert_numpy_to_anime(img_proc, orig_shape)
            results.append(encode_image_to_base64(out_bgr))
        except Exception as e:
            print(f"Error processing image {idx}: {e}")
            return jsonify(status="error", message=str(e)), 500

    return jsonify(status="success", results=results)
