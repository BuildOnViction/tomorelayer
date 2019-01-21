from tornado.web import HTTPError
from logzero import logger
from .base import BaseHandler
from exception import *


class TestHandler(BaseHandler):
    def get(self):
        msg = 'YOLO'
        code = 401
        raise HTTPError(status_code=code, reason=msg)


class AsyncHandler(BaseHandler):
    async def post(self):
        name = self.get_argument('name')
        obj = await self.application.objects.create(TestNameModel, name=name)
        self.write({
            'id': obj.id,
            'name': obj.name
        })

    async def get(self):
        obj_id = self.get_argument('id', None)

        if not obj_id:
            self.write("Please provide the 'id' query argument, i.e. ?id=1")
            return

        try:
            obj = await self.application.objects.get(TestNameModel, id=obj_id)
            self.write({
                'id': obj.id,
                'name': obj.name,
            })
        except TestNameModel.DoesNotExist:
            raise HTTPError(404, "Object not found!")


class TomoHandler(BaseHandler):
    """Documentation for TomoHandler
    Testing's Blockchain interaction of Tornado
    Temporarily remove Registration contract
    We use Test contract only
    """
    def prepare_contract(self):
        web3 = self.application.blockchain.web3
        web3.eth.defaultAccount = web3.eth.accounts[0]
        web3 = self.application.blockchain.web3
        storevar = self.application.blockchain.contracts[0]

        storevar_contract = web3.eth.contract(
            address=storevar['deployedAddress'],
            abi=storevar['abiDefinition'],
        )
        return storevar_contract

    async def post(self):
        var = self.request_body.get('var')
        web3 = self.application.blockchain.web3
        contract = self.prepare_contract()
        tx_hash = contract.functions.setVar(var).transact()
        web3.eth.waitForTransactionReceipt(tx_hash)
        logger.warn(tx_hash)
        self.json_response({'tx_hash': str(tx_hash)})

    async def get(self):
        contract = self.prepare_contract()
        getvar = contract.functions.getVar().call()
        self.json_response({'getvar': getvar})
