import torch
from torchvision import transforms
from PIL import Image
import os

# Đảm bảo bạn đã cài đặt AnimeGANv3
# Đường dẫn tới thư mục chứa ảnh đầu vào và thư mục lưu ảnh đầu ra
input_dir = "./assets"
output_dir = "./output"
os.makedirs(output_dir, exist_ok=True)

# Tải mô hình AnimeGANv3 (Giả sử bạn đã tải mô hình trước đó)
# Bạn có thể thay thế bằng cách tải mô hình trực tiếp nếu cần
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = torch.load('path_to_animeganv3_model.pth', map_location=device)  # Thay đổi theo đường dẫn của mô hình

# Chuyển ảnh sang kiểu tensor
transform = transforms.Compose([
    transforms.Resize((256, 256)),  # Thay đổi kích thước ảnh nếu cần
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]),
])

# Hàm chuyển ảnh thành ảnh hoạt hình
def convert_to_anime(image_path, output_path):
    # Mở ảnh
    img = Image.open(image_path).convert("RGB")
    
    # Áp dụng transform
    img_tensor = transform(img).unsqueeze(0).to(device)

    # Chạy mô hình
    with torch.no_grad():
        model.eval()
        animated_img = model(img_tensor)

    # Lưu ảnh đầu ra
    animated_img = animated_img.squeeze(0).cpu().clamp(0, 1).numpy().transpose(1, 2, 0) * 255
    animated_img = Image.fromarray(animated_img.astype('uint8'))
    animated_img.save(output_path)

# Duyệt qua các ảnh trong thư mục 'assets' và chuyển đổi chúng
for img_name in os.listdir(input_dir):
    if img_name.endswith(('.png', '.jpg', '.jpeg')):
        input_path = os.path.join(input_dir, img_name)
        output_path = os.path.join(output_dir, f"anime_{img_name}")
        convert_to_anime(input_path, output_path)
        print(f"Converted {img_name} to anime style and saved to {output_path}")
