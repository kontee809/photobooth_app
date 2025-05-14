#from cmath import e
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from models.payment_model import Payment
from models.user_model import User
from core.database import db
from utils.jwt_helper import create_access_token, verify_password, verify_token
import re
#from sqlalchemy.exc import IntegrityError

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'Missing request data'}), 400

    user_name = data['user_name']
    email = data['email']
    password = data['password']

    if not user_name or not email or not password:
        return jsonify({'error': 'Missing user_name, email, or password'}), 400

    # Kiểm tra trùng email
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        print("Email ton tai")
        return jsonify({'error': 'Email already exists'}), 409  # HTTP 409 Conflict

    # Tạo user
    user = User(
        user_name=user_name,
        email=email,
        password_hash=generate_password_hash(password)
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
    else:
        return jsonify({'message': 'Tài khoản hoặc mật khẩu không đúng!'}), 401
    

@auth_bp.route('/check_payment', methods=['POST'])
def check_payment():
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401

    token = auth_header.split(" ")[1]
    payload = verify_token(token)

    if not payload:
        return jsonify({"error": "Invalid or expired token"}), 401

    user_id = payload.get("id")
    user = User.query.filter_by(id=user_id).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if not user.is_premium:
        return jsonify({"message": "User has not purchased premium"}), 403

    return jsonify({"message": f"User {user.user_name} has premium access."})


@auth_bp.route('/update', methods=['POST'])
def updatePremium():
    data = request.json
    print("Received payment update:", data)

    try:
        result_code = int(data.get('resultCode', 1))
        if result_code != 0:
            return jsonify({'message': 'Payment failed'}), 200

        # Lấy user_id từ orderId: ví dụ "user1_abc123"
        raw_id = data['orderId'].split('_')[0]  # "user1"
        user_id = int(re.sub(r'\D', '', raw_id))  # "1"

        print("Parsed user_id:", user_id)

        amount = float(data['amount'])

        # Tạo bản ghi payment
        payment = Payment(
            user_id=user_id,
            amount=amount,
            plan_duration=data.get('plan_duration', '7')
        )
        db.session.add(payment)

        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404

        user.is_premium = True
        db.session.commit()

        return jsonify({'payURL': 'http://localhost:3000/camera-ai'}), 200

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        db.session.rollback()
        return jsonify({'message': str(e)}), 500