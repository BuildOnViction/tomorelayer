import json
from logzero import logger
from playhouse.shortcuts import model_to_dict
from model import Contract, Relayer, Token
from .base import BaseHandler


class PublicHandler(BaseHandler):

    async def get(self):
        redis = await self.application.redis()
        keys = await redis.hlen('public_res')
        logger.debug('Length = %d', keys)

        if keys:
            cached = await redis.hmget('public_res', 'relayers', 'contracts', 'tokens', encoding='utf-8')
            logger.debug(cached)
            return self.json_response(cached)

        relayers = [model_to_dict(relayer or {}) for relayer in Relayer.select()]
        contracts = [model_to_dict(c or {}) for c in Contract.select().where(Contract.obsolete == False)]
        tokens = [model_to_dict(token or {}) for token in Token.select()]
        self.json_response({
            'Relayers': relayers,
            'Contracts': contracts,
            'Tokens': tokens
        })
        await redis.hmset_dict('public_res',
                               relayers=json.dumps(relayers),
                               contracts=json.dumps(contracts),
                               tokens=json.dumps(tokens))
