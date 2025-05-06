import os
import torch
from torchvision import transforms
from PIL import Image
from AnimeGANv3_hay import AnimeGANv3

# Thiết lập thiết bị (GPU nếu có, nếu không dùng CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Đường dẫn đến thư mục chứa ảnh đầu vào và đầu ra
input_folder = './assets'  # Thư mục chứa ảnh đầu vào
output_folder = './output'  # Thư mục chứa ảnh đầu ra

# Đảm bảo thư mục output tồn tại
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# Tải mô hình đã huấn luyện
model = AnimeGANv3()
model.load_state_dict(torch.load('./AnimeGANv3/AnimeGANv3_hayao.py'))  # Thay 'AnimeGANv3_hayao.pth' bằng đường dẫn tệp mô hình của bạn
model = model.to(device)
model.eval()  # Đặt mô hình ở chế độ đánh giá

# Hàm chuyển ảnh đầu vào thành ảnh hoạt hình
def transform_image(input_image_path):
    image = Image.open(input_image_path).convert('RGB')
    transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
    ])
    image = transform(image).unsqueeze(0).to(device)
    return image

# Hàm chuyển ảnh và lưu kết quả
def generate_anime_image(input_image_path, output_image_path):
    input_image = transform_image(input_image_path)
    with torch.no_grad():
        output_image = model(input_image)
    
    # Chuyển tensor thành ảnh và lưu lại
    output_image = output_image.squeeze().cpu().clamp(0, 1).numpy().transpose(1, 2, 0) * 255
    output_image = Image.fromarray(output_image.astype('uint8'))
    output_image.save(output_image_path)

# Duyệt qua tất cả các ảnh trong thư mục assets và xử lý
for filename in os.listdir(input_folder):
    input_image_path = os.path.join(input_folder, filename)
    if os.path.isfile(input_image_path):
        output_image_path = os.path.join(output_folder, f'anime_{filename}')
        generate_anime_image(input_image_path, output_image_path)
        print(f"Đã chuyển đổi {filename} thành {output_image_path}")
