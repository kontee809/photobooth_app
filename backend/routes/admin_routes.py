import json
import urllib.request
import urllib
import uuid
import requests
import hmac
import hashlib
from core.database import db
from sqlalchemy import func 
from models.user_model import User
from models.payment_model import Payment

from utils.jwt_helper import verify_token
from flask import Blueprint, request, jsonify


admin = Blueprint('admin', __name__)



def get_authenticated_user():
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        return None, jsonify({"error": "Unauthorized"}), 401

    token = auth_header.split(" ")[1]
    payload = verify_token(token)

    if not payload:
        return None, jsonify({"error": "Invalid or expired token"}), 401

    return payload, None, None


@admin.route('/checkRole', methods=['POST'])
def checkRole():
    payload, error_response, status_code = get_authenticated_user()
    if error_response:
        return error_response, status_code
    role = payload.get("role")
    return jsonify({
        'role': role,
    })
@admin.route('/getlistUser', methods=['POST'])
def getList_User():
    payload, error_response, status_code = get_authenticated_user()
    if error_response:
        return error_response, status_code

    data_users = User.query.all()
    admin = User.query.filter_by(role='admin').first()
    total_amount = db.session.query(func.sum(Payment.amount)).scalar()
    total_amount = int(total_amount) if total_amount else 0
    formatted_amount = format_vnd(total_amount)
    users_dict = []
    for user in data_users:
        users_dict.append({
            "id": user.id,
            "user_name": user.user_name,
            "email": user.email,
            "is_premium": user.is_premium,
            "role": user.role
        })

    return jsonify({
        'data_user': users_dict,
        'admin': admin.role if admin else None ,
        'total_amount': formatted_amount# tránh lỗi nếu không có admin trong DB
    })

def format_vnd(amount):
    return f"{amount:,}".replace(",", ".")


# @admin.route('/checkRole' , methods=['POST'])
# def checkRole(): 
#     payload, error_response, status_code = get_authenticated_user()
#     if error_response:
#         return error_response, status_code
    




