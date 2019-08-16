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

    @admin_required
    @save_redis(field='contract')
    async def patch(self):
        """
        Save contracts
        """
        contract = self.request_body
        contract_id = contract.get('id', None)

        if not contract_id:
            raise InvalidValueException('Missing contract id')

        del contract['id']

        try:
            query = (Contract.update(**contract).where(Contract.id == contract_id).returning(Contract))
            cursor = query.execute()
            self.json_response(model_to_dict(cursor[0]))
        except IndexError:
            raise InvalidValueException('contract id={param} does not exist'.format(param=str(contract_id)))
        except ProgrammingError:
            raise InvalidValueException('update payload is invalid: {param}'.format(param=str(contract)))
