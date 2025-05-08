from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from models.user_model import User
from core.database import db
from utils.jwt_helper import create_access_token, verify_password

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    user = User(
        user_name=data['user_name'],
        email=data['email'],
        password_hash=generate_password_hash(data['password'])
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and verify_password(data['password'], user.password_hash):
        access_token = create_access_token({'id': user.id, 'email': user.email})
        return jsonify({'access_token': access_token})
    return jsonify({'message': 'Invalid credentials'}), 401
