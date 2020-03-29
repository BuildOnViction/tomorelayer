import json
from logzero import logger
from playhouse.shortcuts import model_to_dict
from model import Relayer, Token
from .base import BaseHandler
from blockchain import Blockchain


class PublicHandler(BaseHandler):

    async def get(self):
        relayers = [model_to_dict(relayer or {}) for relayer in Relayer.select()]
        tokens = [model_to_dict(token or {}) for token in Token.select()]
        contracts = Blockchain.contracts

        self.json_response({
            'Relayers': relayers,
            'Contracts': contracts,
            'Tokens': tokens
        })
