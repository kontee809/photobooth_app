import base64
import numpy as np
import cv2
from rembg import remove
from sqlalchemy.sql import func

MAX_DIM = 1024

def process_image(img: np.ndarray, x8: bool = True) -> np.ndarray:
    h, w = img.shape[:2]
    if max(h, w) > MAX_DIM:
        scale = MAX_DIM / max(h, w)
        new_h, new_w = int(h * scale), int(w * scale)
        img = cv2.resize(img, (new_w, new_h))
    if x8:
        def to_8s(x): return 256 if x < 256 else x - x % 8
        img = cv2.resize(img, (to_8s(w), to_8s(h)))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB).astype(np.float32) / 127.5 - 1.0
    return img

def remove_background_and_merge(foreground_img, background_img):

    # Loại bỏ nền
    _, buffer = cv2.imencode('.png', foreground_img)
    removed_bytes = remove(buffer.tobytes())
    fg = cv2.imdecode(np.frombuffer(removed_bytes, np.uint8), cv2.IMREAD_UNCHANGED)

    # Resize background to match
    bg_resized = cv2.resize(background_img, (fg.shape[1], fg.shape[0]))

    # Tách alpha và ghép
    alpha = fg[:, :, 3] / 255.0
    fg_rgb = fg[:, :, :3]
    composite = np.zeros_like(fg_rgb)
    for c in range(3):
        composite[:, :, c] = fg_rgb[:, :, c] * alpha + bg_resized[:, :, c] * (1 - alpha)

    return composite


def convert_numpy_to_anime(img_np: np.ndarray, orig_shape: tuple) -> np.ndarray:
    from routes.process_routes import session  # tránh vòng lặp import
    in_name = session.get_inputs()[0].name
    fake = session.run(None, {in_name: img_np})[0]
    img = np.squeeze(fake)
    img = (img + 1.) / 2 * 255
    img = np.clip(img, 0, 255).astype(np.uint8)
    out = cv2.resize(img, (orig_shape[1], orig_shape[0]))
    return cv2.cvtColor(out, cv2.COLOR_RGB2BGR)

def decode_base64_image(data_url: str) -> np.ndarray:
    header, encoded = data_url.split(',', 1)
    data = base64.b64decode(encoded)
    buf = np.frombuffer(data, dtype=np.uint8)
    img = cv2.imdecode(buf, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Invalid image")
    return img

def encode_image_to_base64(img: np.ndarray) -> str:
    success, buffer = cv2.imencode('.jpg', img)
    if not success:
        raise ValueError("Failed to encode image")
    encoded = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/jpeg;base64,{encoded}"
