import os
from exception import AuthorizationException


def admin_required(handler):

    def wrapped_handler(handler_object):
        header = handler_object.request.headers
        authorization = header.get('Authorization', '')
        if authorization != os.getenv('SECRET_HEADER'):
            raise AuthorizationException
        return handler(handler_object)

    return wrapped_handler


def json_header(handler):

    def wrapped_handler(response):
        response.set_header('Content-Type', 'application/json')
        response.set_header('Access-Control-Allow-Origin', '*')
        return handler(response)

    return wrapped_handler
