import jwt
import datetime
from flask import current_app
from werkzeug.security import check_password_hash

def create_access_token(data, expires_in=3600):
    payload = {
        **data,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=expires_in)
    }
    token = jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")
    return token

def verify_password(plain_password, hashed_password):
    return check_password_hash(hashed_password, plain_password)
