import jwt
from logzero import logger
from settings import JWT_SECRET

JWT_ALGORITHM = 'HS256'


def decode_token(encoded_jwt):
    payload = jwt.decode(encoded_jwt, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return payload


def encode_payload(payload):
    from datetime import datetime, timedelta
    expiry = datetime.now() + timedelta(minutes=60)
    time_signed_payload = {**payload, 'exp': expiry.timestamp()}
    token = jwt.encode(time_signed_payload, JWT_SECRET, algorithm=JWT_ALGORITHM).decode('utf-8')
    return token, expiry.timestamp()
