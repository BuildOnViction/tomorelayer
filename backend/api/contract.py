from playhouse.shortcuts import model_to_dict
from model import Contract
from exception import InvalidValueException
from util.decorator import admin_required, authenticated, save_redis
from .base import BaseHandler


class ContractHandler(BaseHandler):

    @authenticated
    def get(self, user=None):
        contracts = []
        contracts = [model_to_dict(c or {}) for c in Contract.select().where(Contract.obsolete == False)]
        self.json_response(contracts)

    @admin_required
    @save_redis(field='contract')
    async def post(self):
        contracts = self.request_body

        if not contracts:
            raise InvalidValueException('Invalid empty payload')

        if not isinstance(contracts, list):
            # NOTE: might need to implement Ceberus for Schema Validator
            contract = contracts
            obj = await self.application.objects.create(Contract, **contract)
            return self.json_response(model_to_dict(obj))

        async with self.application.objects.atomic():
            result = []
            for contract in contracts:
                obj = await self.application.objects.create(Contract, **contract)
                result.append(model_to_dict(obj))

            return self.json_response(result)

    @admin_required
    @save_redis(field='contract')
    async def patch(self):
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


# API DOCUMENT
"""
@api {get} /api/contract Get Contract
@apiName getContracts
@apiGroup Contract

@apiDescription This API is for getting Contract.
This API endpoint require authentication, either of user or admin.

@apiPermission user

@apiSuccess {Object[]} contracts Array of in-use (not-obsolete) Contracts

@apiHeaderExample {json} Header-Example:
{
  "Content-Type": "application/json",
  "Authorization" "Bearer user-token-or-admin-token"
}

@apiSampleRequest http://localhost:8888/api/contract

@apiHeader {String} Authorization Users unique access-token
@apiHeader {String} Content-Type Content-Type

@apiSuccessExample {json} Success-Response:
HTTP/1.1 200 OK
{
  "payload": [
     {
       "name": "RelayerRegistration",
       "address": "contract-address",
       "owner": "owner-address"
     },
     {
       "name": "TomoXListing",
       "address": "contract-address",
       "owner": "empty"
     }
   ],
  "meta": ""
}

@apiVersion 0.1.0
"""

"""
@api {post} /api/contract Create Contract
@apiName createContracts
@apiGroup Contract

@apiDescription This API is for creating Contract.
Can be used to create a single contract or multiple contract entities.
This API endpoint require Admin Authentication.
Newly created contracts shall be updated to Redis as well.

@apiPermission admin

@apiSuccess {Object} contract Newly-created Contract

@apiSampleRequest http://localhost:8888/api/contract

@apiHeader {String} Authorization Admin secret token bearer
@apiHeader {String} Content-Type application/json

@apiParam {String} name Contract name
@apiParam {String} owner Contract owner address, required but can just be any valid string
@apiParam {String} address Contract address
@apiParam {Object} abi Contract abi

@apiSuccessExample {json} Success-Response:
HTTP/1.1 200 OK
{
  "payload": {
    "id": 1,
    "name": "RelayerRegistration",
    "address": "contract-address",
    "owner": "owner-address",
    "abi": "...abi-json"
  },
  "meta": ""
}

@apiError Unauthenticated Not permitted to create contract
@apiErrorExample {json} Unauthorized
HTTP/1.1 401 Unauthorized
{
  "error": {
    "code": 401,
    "message": "Not authorized"
  }
}

@apiError Invalid invalid contract payload
@apiErrorExample {json} Invalid Contract Payload:
HTTP/1.1 400 Bad Request
{
  "error": {
    "code": 400,
    "message": "Invalid value(s)",
    "detail": "contract payload is invaid"
  }
}

@apiVersion 0.1.0
"""

"""
@api {patch} /api/contract Update Contract
@apiName updateContracts
@apiGroup Contract

@apiDescription This API is for updating Contract.
Can update one single contract at a time
This API endpoint require Admin Authentication.
Updated contract shall be updated to Redis as well.

@apiPermission admin

@apiSuccess {Object} contract Updated Contract

@apiSampleRequest http://localhost:8888/api/contract

@apiHeader {String} Authorization Admin secret token bearer
@apiHeader {String} Content-Type application/json

@apiParam {String} id Contract ID
@apiParam {String} [name] Contract name
@apiParam {String} [owner] Contract owner address, required but can just be any valid string
@apiParam {String} [address] Contract address
@apiParam {Object} [abi] Contract abi

@apiSuccessExample {json} Success-Response:
HTTP/1.1 200 OK
{
  "payload": {
    "id": 1,
    "name": "RelayerRegistration",
    "address": "contract-address",
    "owner": "owner-address",
    "abi": "...abi-json"
  },
  "meta": ""
}

@apiError Unauthenticated Not permitted to update contract
@apiErrorExample {json} Unauthorized
HTTP/1.1 401 Unauthorized
{
  "error": {
    "code": 401,
    "message": "Not authorized"
  }
}

@apiError MissingID Missing contract ID
@apiErrorExample {json} Missing contract ID
HTTP/1.1 400 Bad Request
{
  "error": {
    "code": 400,
    "message": "Missing contract id"
  }
}

@apiError InvalidContractID Invalid contract id
@apiErrorExample {json} Contract ID does not exist
HTTP/1.1 400 Bad Request
{
  "error": {
    "code": 400,
    "message": "contract id={id} does not exist"
  }
}

@apiError Invalid invalid contract payload
@apiErrorExample {json} Invalid Contract Payload:
HTTP/1.1 400 Bad Request
{
  "error": {
    "code": 400,
    "message": "Invalid value(s)",
    "detail": "update payload is invaid"
  }
}

@apiVersion 0.1.0
"""
