import os
import jwt
from logzero import logger

JWT_SECRET = os.getenv('JWT_SECRET')
JWT_ALGORITHM = 'HS256'


def decode_token(encoded_jwt):
    return jwt.decode(encoded_jwt, JWT_SECRET, algorithm=JWT_ALGORITHM)


def encode_payload(payload):
    from datetime import datetime, timedelta
    expiry = (datetime.utcnow() + timedelta(minutes=10)).timestamp()
    time_signed_payload = {**payload, 'exp': expiry}
    token = jwt.encode(time_signed_payload, JWT_SECRET, algorithm=JWT_ALGORITHM).decode('utf-8')
    return token, expiry
