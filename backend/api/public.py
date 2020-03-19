import json
from logzero import logger
from playhouse.shortcuts import model_to_dict
from model import Contract, Relayer, Token
from .base import BaseHandler
from blockchain import Blockchain


class PublicHandler(BaseHandler):

    async def get(self):
        relayers = [model_to_dict(relayer or {}) for relayer in Relayer.select()]
        contracts = [model_to_dict(c or {}) for c in Contract.select().where(Contract.obsolete == False)]
        tokens = [model_to_dict(token or {}) for token in Token.select()]

        self.json_response({
            'Relayers': relayers,
            'Contracts': contracts,
            'Tokens': tokens
            'RegistrationABI': Blockchain.RegistrationABI
            'TOMOXListingABI': Blockchain.TOMOXListingABI
        })
