from util.decorator import admin_required
from model import Contract
from .base import BaseHandler


class ContractHandler(BaseHandler):

    async def get(self):
        query = await self.application.objects.execute(
            # NOTE: Peewee does not support native Pythonic syntax for Query Operator
            # eg: where(not Contract.obsolete) => invalid
            # or: where(Contract.obsolete is False) => invalid
            Contract.select().where(Contract.obsolete == False).dicts())

        contracts = [contract for contract in query]
        self.json_response(contracts)

    @admin_required
    async def post(self):
        name = self.request_body['name']
        address = self.request_body['address']
        abi = self.request_body['abi']

        async with self.application.objects.atomic():
            contract = await self.application.objects.create(
                Contract,
                name=name,
                address=address,
                abi=abi
            )

            self.json_response({
                'id': contract.id,
                'name': contract.name,
                'address': contract.address,
            })
