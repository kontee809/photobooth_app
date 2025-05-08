import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "hahahahahaha")  # Đảm bảo SECRET_KEY được lấy từ biến môi trường
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'mysql+mysqlconnector://root:123456@localhost:3307/photobooth')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
