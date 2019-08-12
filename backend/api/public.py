import json
from logzero import logger
from aioredis import Redis
from playhouse.shortcuts import model_to_dict
from model import Contract, Relayer, Token
from .base import BaseHandler


class PublicHandler(BaseHandler):

    async def get(self):
        redis = self.application.redis
        keys = await redis.hlen('public_res')
        logger.debug("Length = %d" % keys)

        if keys:
            logger.debug('Existing...')
            cached = await redis.hgetall('public_res')
            logger.debug(cached)
            return self.json_response()

        logger.debug('Nope, set new...')
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
