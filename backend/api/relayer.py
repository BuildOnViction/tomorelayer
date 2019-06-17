from playhouse.shortcuts import model_to_dict
from model import Relayer
from exception import InvalidValueException
from .base import BaseHandler


class RelayerHandler(BaseHandler):

    async def post(self):
        """Add new token"""
        relayer = self.request_body.get('relayer', {})
        response = {}

        async with self.application.objects.atomic():
            obj = None
            if not relayer.get('id'):
                obj = await self.application.objects.create(Relayer, **relayer)
            else:
                relayer_id = relayer['id']
                del relayer['id']
                query = (Relayer.update(**relayer).where(Relayer.id == relayer_id).returning(Relayer))
                cursor = query.execute()
                obj = cursor[0]

            response.update({'relayer': model_to_dict(obj)})
            self.json_response(response)

    async def delete(self):
        """Delete a relayer"""
        relayer_id = self.request_body.get('id')
        if not relayer_id:
            raise InvalidValueException(detail='relayer id must not be empty')
        relayer = Relayer.get(Relayer.id == relayer_id)
        result = relayer.delete_instance()
        self.json_response({'deleted':result})

    async def get(self):
        relayers = []
        try:
            relayers = [model_to_dict(relayer or {}) for relayer in Relayer.select()]
        except Exception:
            pass

        self.json_response(relayers)
