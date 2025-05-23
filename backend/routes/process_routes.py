from flask import Blueprint, request, jsonify
import time, base64
import numpy as np
import cv2
import onnxruntime as ort
from utils.image_utils import decode_base64_image, encode_image_to_base64, process_image, convert_numpy_to_anime, remove_background_and_merge

process_bp = Blueprint('process', __name__)

MODEL_NAME = 'AnimeGANv3_Hayao_STYLE_36'
MAX_DIM = 1024
ONNX_PATH = f'{MODEL_NAME}.onnx'

session = ort.InferenceSession(ONNX_PATH, providers=['CPUExecutionProvider'])

@process_bp.route('/process', methods=['POST'])
def process_image_route():
    try:
        data = request.get_json(force=True)
        images = data.get('images', [])
        mode = data.get('mode', '')
        background = data.get('background', None)

        if not images or not isinstance(images, list):
            return jsonify(status="error", message="Yêu cầu phải có danh sách 'images'"), 400

        results = []

        for idx, data_url in enumerate(images):
            try:
                img = decode_base64_image(data_url)

                if mode == 'anime':
                    img_proc = process_image(img)
                    img_proc = np.expand_dims(img_proc, axis=0)
                    out_bgr = convert_numpy_to_anime(img_proc, img.shape[:2])
                    results.append(encode_image_to_base64(out_bgr))

                elif mode == 'remove-bg':
                    if background is None:
                        return jsonify(status="error", message="Thiếu ảnh nền"), 400

                    bg_img = decode_base64_image(background)
                    out = remove_background_and_merge(img, bg_img)
                    results.append(encode_image_to_base64(out))

                else:
                    return jsonify(status="error", message="Chế độ xử lý không hợp lệ"), 400

            except Exception as e:
                # Ghi lại lỗi chi tiết
                print(f"Lỗi xử lý ảnh {idx}: {str(e)}")
                return jsonify(status="error", message=f"Lỗi xử lý ảnh {idx}: {str(e)}"), 500

        return jsonify(status="success", results=results)

    except Exception as e:
        # Ghi lại lỗi chi tiết
        print(f"Lỗi xử lý yêu cầu: {str(e)}")
        return jsonify(status="error", message=f"Lỗi xử lý yêu cầu: {str(e)}"), 500
