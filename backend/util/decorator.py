import os
from logzero import logger
from tornado.web import HTTPError
from exception import AdminAuthorizationException, UserAuthorizationException
from .jwt_encoder import decode_token


def admin_required(handler):

    def wrapped_handler(handler_object):
        try:
            header = handler_object.request.headers
            authorization = header.get('Authorization', 'Bearer invalidtoken').split(' ')[1]
            if authorization != os.getenv('SECRET_HEADER'):
                raise AdminAuthorizationException
            return handler(handler_object)
        except Exception as err:
            if not isinstance(err, AdminAuthorizationException):
                logger.debug(err)
            raise AdminAuthorizationException

    return wrapped_handler


def json_header(handler):

    def wrapped_handler(response):
        response.set_header('Content-Type', 'application/json')
        response.set_header('Access-Control-Allow-Origin', '*')
        return handler(response)

    return wrapped_handler


def authenticated(handler):

    def wrapped_handler(handler_object):
        header = handler_object.request.headers

        try:
            jwt_token = header.get('Authorization', '').split(' ')[1]
            decoded = decode_token(jwt_token)
            return handler(handler_object, user=decoded['address'])
        except Exception as err:
            raise UserAuthorizationException('Authorization token is invalid')

    return wrapped_handler


def common_authenticated(handler):
    """
    Permitted for both user & admin
    """
    def wrapped_handler(handler_object):
        header = handler_object.request.headers

        try:
            authorization = header.get('Authorization', '').split(' ')[1]
        except IndexError:
            raise UserAuthorizationException('Invalid header')

        try:
            decoded = decode_token(authorization)
            return handler(handler_object, user=decoded['address'])
        except Exception:
            pass

        if authorization != os.getenv('SECRET_HEADER'):
            raise AdminAuthorizationException

        return handler(handler_object, user='not needed')

    return wrapped_handler


def deprecated(handler):

    def wrapped_handler(handler_object):
        raise HTTPError(status_code=404, reason="Invalid api endpoint.")

    return wrapped_handler
