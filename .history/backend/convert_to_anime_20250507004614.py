import os
import torch
from PIL import Image
from torchvision import transforms
from ./AnimeGANv3/ import AnimeGANv3  # Import model from inference.py

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Đảm bảo mô hình AnimeGANv3 đã được tải về từ repo
model = AnimeGANv3().to(device)  # Khởi tạo mô hình

# Giả sử bạn đã tải mô hình đã huấn luyện sẵn
model.load_state_dict(torch.load('AnimeGANv3_hayao.pth', map_location=device))  # Load mô hình

# Đảm bảo thư mục đầu ra tồn tại
output_dir = 'output'
os.makedirs(output_dir, exist_ok=True)

# Duyệt qua tất cả các ảnh trong thư mục 'assets'
input_dir = 'assets'
for image_name in os.listdir(input_dir):
    input_image_path = os.path.join(input_dir, image_name)
    output_image_path = os.path.join(output_dir, f"anime_{image_name}")

    if os.path.isfile(input_image_path):
        image = Image.open(input_image_path)  # Mở ảnh bằng PIL
        transform = transforms.Compose([
            transforms.Resize((256, 256)),  # Thay đổi kích thước ảnh
            transforms.ToTensor(),  # Chuyển đổi ảnh thành tensor
        ])
        image = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            output_image = model(image)  # Chạy mô hình AnimeGANv3

        output_image = transforms.ToPILImage()(output_image.squeeze(0).cpu())  # Chuyển kết quả thành ảnh
        output_image.save(output_image_path)  # Lưu ảnh vào thư mục output

print("Ảnh đã được chuyển đổi thành công và lưu vào thư mục output.")
