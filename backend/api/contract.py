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
        payload = self.request_body.get('contract', None)

        if not payload:
            raise InvalidValueException('relayer payload is empty')

        async with self.application.objects.atomic():
            contract = await self.application.objects.create(Contract, **payload)
            self.json_response(model_to_dict(contract))
