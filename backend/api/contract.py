from playhouse.shortcuts import model_to_dict
from model import Contract
from exception import InvalidValueException
from util.decorator import admin_required, authenticated, save_redis
from .base import BaseHandler


class ContractHandler(BaseHandler):

    @authenticated
    def get(self, user=None):
        """Return all Contracts"""
        contracts = []
        contracts = [model_to_dict(c or {}) for c in Contract.select().where(Contract.obsolete == False)]
        self.json_response(contracts)

    @admin_required
    @save_redis(field='contract')
    async def post(self):
        """
        Add new contracts
        """
        contracts = self.request_body

        if not contracts or not isinstance(contracts, list):
            raise InvalidValueException('contracts payload is invalid')

        async with self.application.objects.atomic():
            result = []
            for contract in contracts:
                obj = await self.application.objects.create(Contract, **contract)
                result.append(model_to_dict(obj))

            self.json_response(result)
