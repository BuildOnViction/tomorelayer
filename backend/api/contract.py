from playhouse.shortcuts import model_to_dict
from logzero import logger
from model import Contract
from .base import BaseHandler
from util.decorator import admin_required


class ContractHandler(BaseHandler):

    def get(self):
        """Return all Contracts"""
        contracts = []
        try:
            contracts = [model_to_dict(c or {}) for c in Contract.select()]
        except Exception:
            # No Contracts in DB yet
            pass

        self.json_response(contracts)

    @admin_required
    async def post(self):
        payload = self.request_body.get('contract', {})
        async with self.application.objects.atomic():
            contract = await self.application.objects.create(Contract, **payload)

        all_contracts = [model_to_dict(c or {}) for c in Contract.select()]
        self.json_response(all_contracts)
