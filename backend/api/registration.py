from model import Relayer
from .base import BaseHandler


class RegisterHandler(BaseHandler):

    async def post(self):
        name = self.request_body['name']
        address = self.request_body['address']
        rl = await self.application.objects.create(Relayer, name=name, address=address)

        self.json_response({
            'id': rl.id,
            'name': rl.name,
            'address': rl.address
        })
