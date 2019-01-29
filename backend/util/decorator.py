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
