from model import Relayer
from .base import BaseHandler
from exception import *


class RegisterHandler(BaseHandler):

    async def post(self):
        missing_fields = []

        for field in ['name', 'address', 'logo']:
            not self.request_body.get(field) and missing_fields.append(field)

        if missing_fields:
            raise MissingArgumentException(', '.join(missing_fields))

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
