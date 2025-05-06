from sqlalchemy import Column, Integer, String
from database import db

class User(db.Model):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_name = Column(String(80), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(200), nullable=False)
    

    def __repr__(self):
        return f'<User {self.user_name}>'
