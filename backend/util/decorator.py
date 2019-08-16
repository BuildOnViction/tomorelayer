import os
import json
from logzero import logger
from tornado.web import HTTPError
from playhouse.shortcuts import model_to_dict
from model import Token, Relayer, Contract
from exception import AdminAuthorizationException, UserAuthorizationException
from .jwt_encoder import decode_token


def admin_required(handler):

    def wrapped_handler(handler_object):
        header = handler_object.request.headers
        authorization = header.get('Authorization', 'Bearer invalidtoken').split(' ')[1]

        if authorization != os.getenv('SECRET_HEADER'):
            raise AdminAuthorizationException

        return handler(handler_object)

    return wrapped_handler


def json_header(handler):

    def wrapped_handler(response):
        response.set_header('Content-Type', 'application/json')
        response.set_header('Access-Control-Allow-Origin', '*')
        return handler(response)

    return wrapped_handler


def authenticated(handler):
    """
    User authentication is required
    """
    def wrapped_handler(handler_object):
        header = handler_object.request.headers

        try:
            jwt_token = header.get('Authorization', 'Bearer some_token').split(' ')[1]

            if jwt_token == os.getenv('SECRET_HEADER'):
                return handler(handler_object, user='admin')

            decoded = decode_token(jwt_token)
            return handler(handler_object, user=decoded['address'])
        except Exception as err:
            raise UserAuthorizationException('Authorization token is invalid: {}'.format(err))

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


def deprecated(_handler):
    """
    Deprecated API shall be denoted with this decorator
    """
    def wrapped_handler(handler_object):
        raise HTTPError(status_code=404, reason="Invalid api endpoint.")

    return wrapped_handler


MODEL_TYPE = {
    'token': Token,
    'contract': Contract,
    'relayer': Relayer,
}

def save_redis(key='public_res', field=None):

    def wrapped(handler):

        async def wrapped_handler(request_handler, *args, **kwargs):
            await handler(request_handler, *args, **kwargs)

            if not field:
                return

            dbmodel = MODEL_TYPE[field]
            hfield = field.capitalize() + 's'

            entities = [model_to_dict(entity or {}) for entity in dbmodel.select()]
            logger.debug('Save new %s to redis', field)
            await request_handler.application.redis.hmset_dict('public_res', {hfield: json.dumps(entities)})

        return wrapped_handler

    return wrapped
