from model import Relayer
from .base import BaseHandler


class RegisterHandler(BaseHandler):

    async def post(self):
        name = self.request_body['name']
        address = self.request_body['address']
        logo = self.request_body['logo']
        dex_rate = self.request_body['dex_rate']
        foundation_rate = self.request_body['foundation_rate']

        async with self.application.objects.atomic():
            rl = await self.application.objects.create(
                Relayer,
                name=name,
                address=address,
                logo=logo,
                dex_rate=dex_rate,
                foundation_rate=foundation_rate,
            )

            self.json_response({
                'id': rl.id,
                'name': rl.name,
                'address': rl.address,
                'dex_rate': rl.dex_rate,
                'foundation_rate': rl.foundation_rate,
                'logo': rl.logo,
            })
