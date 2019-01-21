from web3 import Web3
from model import Relayer
from .base import BaseHandler
from exception import MissingArgumentException
from exception import InvalidValueException
from logzero import logger


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

        web3 = self.application.blockchain.web3
        relayer_contract = self.application.blockchain.relayer_contract

        if dex_rate >= 1:
            raise InvalidValueException('Dex_rate must be less than 1')

        if not web3.isAddress(address):
            raise InvalidValueException('Invalid Address')

        registered, *tail = relayer_contract.functions.getSingleRelayer(address).call()

        if registered:
            # TODO: verify if its in Database
            raise InvalidValueException('This address is already registered as a relayer')

        # FIXME: relayer-name collision is not considered when registering to SmartContract
        tx_hash = relayer_contract.functions.register(address, int(dex_rate * 100), 0).transact()
        tx_receipt = web3.eth.getTransactionReceipt(tx_hash)
        resp = relayer_contract.events.NewRelayer().processReceipt(tx_receipt)

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
