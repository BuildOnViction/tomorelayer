from playhouse.shortcuts import model_to_dict
from peewee import ProgrammingError
from model import Relayer
from exception import InvalidValueException, MissingArgumentException
from util.decorator import authenticated, save_redis
from .base import BaseHandler


class RelayerHandler(BaseHandler):

    @authenticated
    async def get(self, user):
        relayers = [model_to_dict(relayer or {}) for relayer in Relayer.select().where(Relayer.owner == user)]
        self.json_response(relayers)

    @authenticated
    @save_redis(field='relayer')
    async def post(self, user):
        """Add new relayer"""
        relayer = self.request_body

        if user != relayer['owner']:
            raise InvalidValueException('Owner address does not match user_address')

        try:
            obj = await self.application.objects.create(Relayer, **relayer)
            self.json_response(model_to_dict(obj))
        except Exception:
            raise InvalidValueException('relayer payload is invalid: {param}'.format(param=str(relayer)))

    @authenticated
    @save_redis(field='relayer')
    async def patch(self, user):
        """Update existing relayer"""
        relayer = self.request_body
        relayer_id = relayer.get('id', None)
        relayer_owner = relayer.get('owner', None)

        if not relayer_id:
            raise MissingArgumentException('missing relayer id')

        if not relayer_owner or relayer_owner != user:
            raise InvalidValueException('Owner address does not match user_address')

        del relayer['id']

        if relayer.get('new_owner', None):
            relayer['owner'] = relayer['new_owner']
            del relayer['new_owner']

        try:
            query = (Relayer.update(**relayer).where(Relayer.id == relayer_id).returning(Relayer))
            cursor = query.execute()
            self.json_response(model_to_dict(cursor[0]))
        except IndexError:
            raise InvalidValueException('relayer id={param} does not exist'.format(param=str(relayer_id)))
        except ProgrammingError:
            raise InvalidValueException('update payload is invalid: {param}'.format(param=str(relayer)))

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
