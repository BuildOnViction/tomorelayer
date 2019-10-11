from logzero import logger
from playhouse.shortcuts import model_to_dict
from peewee import ProgrammingError
from model import Relayer
from exception import InvalidValueException, MissingArgumentException
from util.decorator import authenticated, save_redis
from .base import BaseHandler


RELAYER_SCHEMA = {
    'owner': {
        'type': 'string',
        'is_address': True,
        'required': True,
    },
    'name': {
        'type': 'string',
        'minlength': 3,
        'maxlength': 200,
        'required': True,
    },
    'coinbase': {
        'type': 'string',
        'is_address': True,
        'required': True,
    },
    'deposit': {
        'type': 'string',
        'required': True,
    },
    'trade_fee': {
        'type': 'number',
        'min': 1,
        'max': 9999,
        'required': True,
    },
    'from_tokens': {
        'type': 'list',
        'schema': {
            'type': 'string',
            'is_address': True,
        },
        'minlength': 0,
        'required': True,
    },
    'to_tokens': {
        'type': 'list',
        'schema': {
            'type': 'string',
            'is_address': True,
        },
        'minlength': 0,
        'required': True,
    },
    'logo': {
        'type': 'string',
        'nullable': True,
    },
    'link': {
        'type': 'string',
        'nullable': True,
    },
    'resigning': {
        'type': 'boolean',
        'default': False,
    },
    'lock_time': {
        'type': 'number',
        'nullable': True,
    },
}


def verify_user(user, relayer_owner):
    if not user:
        raise InvalidValueException('Missing user address')

    if not relayer_owner:
        raise InvalidValueException('Missing relayer owner address')

    if user.lower() != relayer_owner.lower():
        raise InvalidValueException('Owner address does not match relayer_owner address')


class RelayerHandler(BaseHandler):

    schema = RELAYER_SCHEMA

    @authenticated
    async def get(self, user):
        relayers = [model_to_dict(relayer or {}) for relayer in Relayer.select().where(Relayer.owner == user)]
        self.json_response(relayers)

    @authenticated
    @save_redis(field='relayer')
    async def post(self, user):
        """Add new relayer"""
        relayer = self.request_body

        verify_user(user, relayer['owner'])

        if not self.validator.validate(relayer):
            raise InvalidValueException(str(self.validator.document_error_tree))

        normalized_relayer = self.validator.normalized(relayer)

        obj = await self.application.objects.create(Relayer, **normalized_relayer)
        self.json_response(model_to_dict(obj))

    @authenticated
    @save_redis(field='relayer')
    async def patch(self, user):
        """Update existing relayer"""
        relayer = self.request_body
        relayer_id = relayer.get('id', None)
        relayer_owner = relayer.get('owner', None)

        verify_user(user, relayer_owner)

        if not relayer_id:
            raise MissingArgumentException('missing relayer id')

        del relayer['id']

        if relayer.get('new_owner', None):
            relayer['owner'] = relayer['new_owner']
            del relayer['new_owner']

        if not self.validator.validate(relayer):
            raise InvalidValueException(str(self.validator.document_error_tree))

        normalized_relayer = self.validator.normalized(relayer)

        try:
            query = (Relayer.update(**normalized_relayer).where(Relayer.id == relayer_id).returning(Relayer))
            cursor = query.execute()
            self.json_response(model_to_dict(cursor[0]))
        except IndexError:
            raise InvalidValueException('relayer id={param} does not exist'.format(param=str(relayer_id)))

    @authenticated
    @save_redis(field='relayer')
    async def delete(self, user):
        """Delete a relayer"""
        relayer_id = self.get_argument('id', None)

        if not relayer_id:
            raise MissingArgumentException('missing relayer id')

        try:
            relayer = Relayer.select().where(Relayer.owner == user, Relayer.id == relayer_id).get()
            relayer.delete_instance()
            self.json_response({})
        except Exception:
            raise InvalidValueException('invalid relayer: relayer with id={} or owner={} does not exist'.format(relayer_id, user))
