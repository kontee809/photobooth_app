import os

class Config:
    # Cấu hình kết nối MySQL
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'mysql+mysqlconnector://root@localhost/photobooth')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'hahahahahaha'
