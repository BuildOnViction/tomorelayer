from playhouse.shortcuts import model_to_dict
from peewee import ProgrammingError
from model import Relayer
from exception import InvalidValueException, MissingArgumentException
from .base import BaseHandler


class RelayerHandler(BaseHandler):

    async def get(self):
        relayers = []
        relayers = [model_to_dict(relayer or {}) for relayer in Relayer.select()]
        self.json_response(relayers)

    async def post(self):
        """Add new relayer"""
        relayer = self.request_body
        try:
            obj = await self.application.objects.create(Relayer, **relayer)
            self.json_response(model_to_dict(obj))
        except Exception as err:
            raise InvalidValueException('relayer payload is invalid: {param}'.format(param=str(relayer)))

    async def patch(self):
        """Update existing relayer"""
        relayer = self.request_body
        relayer_id = relayer.get('id', None)

        if not relayer_id:
            raise MissingArgumentException('missing relayer id')

        del relayer['id']

        try:
            query = (Relayer.update(**relayer).where(Relayer.id == relayer_id).returning(Relayer))
            cursor = query.execute()
            obj = cursor[0]
            self.json_response(model_to_dict(obj))
        except IndexError as err:
            raise InvalidValueException('relayer id={param} does not exist'.format(param=str(relayer_id)))
        except ProgrammingError as err:
            raise InvalidValueException('update payload is invalid: {param}'.format(param=str(relayer)))

    async def delete(self):
        """Delete a relayer"""
        relayer_id = self.get_argument('id', None)

        if not relayer_id:
            raise MissingArgumentException('missing relayer id')

        try:
            relayer = Relayer.get(Relayer.id == relayer_id)
            relayer.delete_instance()
            self.json_response({})
        except Exception as err:
            raise InvalidValueException('relayerId: {param} -- {error}'.format(param=relayer_id, error=err.__class__.__name__))
