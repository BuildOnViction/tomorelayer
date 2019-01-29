from web3 import Web3
from model import Relayer
from .base import BaseHandler
from exception import MissingArgumentException
from exception import InvalidValueException
from logzero import logger


class RegisterHandler(BaseHandler):

    async def post(self):
        name = self.request_body['name']
        address = self.request_body['address']
        logo = self.request_body['logo']
        dex_rate = self.request_body['dex_rate']

        # TODO: check relayer must be already resgistered in blockchain

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
