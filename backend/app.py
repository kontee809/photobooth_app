from flask import Flask
from flask_cors import CORS
from core.config import Config  # Import class Config
from core.database import db  # Import db
from routes.auth_routes import auth_bp  # Import blueprint
from routes.process_routes import process_bp  # Import blueprint

app = Flask(__name__)
app.config.from_object(Config)  # Áp dụng cấu hình từ class Config

db.init_app(app)  # Khởi tạo db với Flask app

CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(process_bp)

# Tạo bảng nếu chưa có
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
