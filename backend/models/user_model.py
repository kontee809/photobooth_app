from core.database import db
from sqlalchemy.sql import func

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('user', 'admin', name='role_enum'), default='user')
    is_premium = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.TIMESTAMP, default=func.current_timestamp())

    def __repr__(self):
        return f'<User {self.email}>'
