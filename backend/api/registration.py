from model import Relayer
from .base import BaseHandler


class RegisterHandler(BaseHandler):

    async def post(self):
        name = self.request_body['name']
        address = self.request_body['address']
        logo = self.request_body['logo']
        rl = await self.application.objects.create(Relayer, name=name, address=address, logo=logo)

        self.json_response({
            'id': rl.id,
            'name': rl.name,
            'address': rl.address,
            'logo': rl.logo,
        })
