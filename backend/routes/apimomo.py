import json
import urllib.request
import urllib
import uuid
import requests
import hmac
import hashlib
from core.database import db
from models.user_model import User
from models.payment_model import Payment
from utils.jwt_helper import verify_token
from flask import Blueprint, request, jsonify
from utils.momo import create_momo_payment

momo_bp = Blueprint("momo", __name__)  # Tạo blueprint

@momo_bp.route("/create_payment", methods=["POST"] , endpoint="create_momo_payment")
def create_payment():
    data = request.get_json()
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401

    token = auth_header.split(" ")[1]
    payload = verify_token(token)

    if not payload:
        return jsonify({"error": "Invalid or expired token"}), 401

    user_id = payload.get("id")
    print(data)
    amount = data.get("amount")

    if not user_id or not amount:
        return jsonify({"error": "Thiếu user_id hoặc amount"}), 400

    order_id = f"user{user_id}_{str(uuid.uuid4())[:8]}"
    momo_response = create_momo_payment(amount, order_id, user_id)
    

    return jsonify(momo_response)



