from model import Relayer
from .base import BaseHandler
from exception import *


class RegisterHandler(BaseHandler):

    async def post(self):
        missing_fields = []

        for field in ['name', 'address', 'logo', 'dex_rate']:
            not self.request_body.get(field) and missing_fields.append(field)

        if missing_fields:
            raise MissingArgumentException(', '.join(missing_fields))

        name = self.request_body['name']
        address = self.request_body['address']
        logo = self.request_body['logo']
        dex_rate = self.request_body['dex_rate']

        if dex_rate >= 1:
            raise InvalidValueException('Dex_rate must be less than 1')

        # TODO: register with SmartContract
        async with self.application.objects.atomic():
            rl = await self.application.objects.create(
                Relayer,
                name=name,
                address=address,
                logo=logo,
                dex_rate=dex_rate,
            )

            self.json_response({
                'id': rl.id,
                'name': rl.name,
                'address': rl.address,
                'dex_rate': rl.dex_rate,
                'logo': rl.logo,
            })
