from playhouse.shortcuts import model_to_dict
from model import Relayer
from exception import InvalidValueException
from .base import BaseHandler


class RelayerHandler(BaseHandler):

    async def get(self):
        relayers = []
        relayers = [model_to_dict(relayer or {}) for relayer in Relayer.select()]
        self.json_response(relayers)

    async def post(self):
        """Add new relayer"""
        relayer = self.request_body
        obj = await self.application.objects.create(Relayer, **relayer)
        self.json_response(model_to_dict(obj))

    async def patch(self):
        """Update existing relayer"""
        relayer = self.request_body
        relayer_id = relayer.get('id')
        del relayer['id']
        query = (Relayer.update(**relayer).where(Relayer.id == relayer_id).returning(Relayer))
        cursor = query.execute()
        obj = cursor[0]
        self.json_response(model_to_dict(obj))

    async def delete(self):
        """Delete a relayer"""
        relayer_id = self.get_argument('id')
        relayer = Relayer.get(Relayer.id == relayer_id)
        result = relayer.delete_instance()
        self.json_response({})
