from playhouse.shortcuts import model_to_dict
from model import Token
from util.decorator import authenticated, common_authenticated
from exception import InvalidValueException
from .base import BaseHandler
from blockchain import Blockchain


class TokenHandler(BaseHandler):

    @authenticated
    def get(self, user=None):
        """Return all available tokens for trading"""
        tokens = [model_to_dict(token or {}) for token in Token.select()]
        self.json_response(tokens)

    @common_authenticated
    async def post(self, user=None):
        """Add new tokens"""
        tokens = self.request_body

        if not tokens:
            raise InvalidValueException('Invalid empty payload')

        b = Blockchain()
        if not isinstance(tokens, list):
            token = tokens
            address = b.web3.toChecksumAddress(token['address'])
            b.updateToken(address)
            obj = Token.select().where(Token.address == address).get()
            return self.json_response(model_to_dict(obj))

        result = []
        for token in tokens:
            address = b.web3.toChecksumAddress(token['address'])
            b.updateToken(address)
            obj = Token.select().where(Token.address == address).get()
            result.append(model_to_dict(obj))

        self.json_response(result)
