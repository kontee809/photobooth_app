from flask import Flask, request, jsonify
from database import db
from models import User
from werkzeug.security import generate_password_hash
from config import Config
from flask_cors import CORS
from until import create_access_token, verify_password

# Khởi tạo ứng dụng Flask
app = Flask(__name__)

# Tải cấu hình từ config.py
app.config.from_object(Config)
CORS(app)
# Kết nối cơ sở dữ liệu
db.init_app(app)

# Tạo bảng nếu chưa có
with app.app_context():
    db.create_all()

# Định nghĩa route đăng ký
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password') or not data.get('user_name'):
        return jsonify({"error": "Thiếu thông tin đăng ký"}), 400

    # Kiểm tra email đã tồn tại chưa
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email đã được sử dụng."}), 400

    # Mã hóa mật khẩu
    hashed_password = generate_password_hash(data['password'])

    # Tạo người dùng mới
    new_user = User(
        user_name=data['user_name'],
        email=data['email'],
        password_hash=hashed_password
    )
    print(new_user)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Đăng ký thành công", "id": new_user.id})


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Thiếu email hoặc mật khẩu"}), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user or not verify_password(data['password'], user.password_hash):
        return jsonify({"error": "Email hoặc mật khẩu không đúng"}), 401

    access_token = create_access_token({
        "id": user.id,
        "user_name": user.user_name,
        "email": user.email,
    })
    print("dang nhap thanh cong")
    return jsonify({"message": "Đăng nhập thành công", "access_token": access_token})


if __name__ == '__main__':
    app.run(debug=True)
