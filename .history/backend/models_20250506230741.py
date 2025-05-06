from sqlalchemy import Column, Integer, String, Boolean, Enum, TIMESTAMP
from sqlalchemy.sql import func
from database import db

class User(db.Model):
    _tablename_ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_name = Column(String(80), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum('user', 'admin', name='role_enum'), default='user')
    is_premium = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP, default=func.current_timestamp())

    def __repr__(self):
        return f'<User {self.email}>'