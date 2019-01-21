from tornado.web import HTTPError
from logzero import logger
from .base import BaseHandler
from exception import *


# class TestHandler(BaseHandler):
#     def get(self):
#         msg = 'YOLO'
#         code = 401
#         raise HTTPError(status_code=code, reason=msg)


# class AsyncHandler(BaseHandler):
#     async def post(self):
#         name = self.get_argument('name')
#         obj = await self.application.objects.create(TestNameModel, name=name)
#         self.write({
#             'id': obj.id,
#             'name': obj.name
#         })

#     async def get(self):
#         obj_id = self.get_argument('id', None)

#         if not obj_id:
#             self.write("Please provide the 'id' query argument, i.e. ?id=1")
#             return

#         try:
#             obj = await self.application.objects.get(TestNameModel, id=obj_id)
#             self.write({
#                 'id': obj.id,
#                 'name': obj.name,
#             })
#         except TestNameModel.DoesNotExist:
#             raise HTTPError(404, "Object not found!")


class TomoHandler(BaseHandler):
    """Documentation for TomoHandler
    Testing's Blockchain interaction of Tornado
    """
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
        contract_data = self.application.blockchain.contracts

        if dex_rate >= 1:
            raise InvalidValueException('Dex_rate must be less than 1')

        if not web3.isAddress(address):
            logger.error('Not valid address')
            raise InvalidValueException('Invalid address')

        self.json_response({ 'success': True })
