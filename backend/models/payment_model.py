from core.database import db
from sqlalchemy.sql import func

class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.TIMESTAMP, default=func.current_timestamp())
    plan_duration = db.Column(db.Enum('7', '15', '30', name='plan_duration_enum'))

    user = db.relationship('User', backref=db.backref('payments', cascade='all, delete-orphan'))

    def __repr__(self):
        return f'<Payment {self.id} - User {self.user_id} - {self.amount}>'
