import json
from logzero import logger
from playhouse.shortcuts import model_to_dict
from model import Contract, Relayer, Token
from .base import BaseHandler


class PublicHandler(BaseHandler):

    async def get(self):
        # redis = self.application.redis
        # keys = await redis.hlen('public_res')
        # logger.debug('Length = %d', keys)

        # if keys:
        #     cached = await redis.hgetall('public_res', encoding='utf-8')
        #     return self.json_response({k: json.loads(v) for k, v in cached.items()})

        relayers = [model_to_dict(relayer or {}) for relayer in Relayer.select()]
        contracts = [model_to_dict(c or {}) for c in Contract.select().where(Contract.obsolete == False)]
        tokens = [model_to_dict(token or {}) for token in Token.select()]
        self.json_response({
            'Relayers': relayers,
            'Contracts': contracts,
            'Tokens': tokens
        })
        # await redis.hmset_dict('public_res',
        #                        Relayers=json.dumps(relayers),
        #                        Contracts=json.dumps(contracts),
        #                        Tokens=json.dumps(tokens))
