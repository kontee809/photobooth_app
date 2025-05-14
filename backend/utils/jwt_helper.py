import jwt
import datetime
from flask import current_app
from werkzeug.security import check_password_hash
from jwt.exceptions import InvalidTokenError

def create_access_token(data, expires_in=3600):
    payload = {**data, 'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=expires_in)}
    return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')

def verify_password(plain_password, hashed_password):
    return check_password_hash(hashed_password, plain_password)

def verify_token(token):
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
        return payload
    except InvalidTokenError:
        return None