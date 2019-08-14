from playhouse.shortcuts import model_to_dict
from model import Token
from util.decorator import authenticated, common_authenticated, save_redis
from exception import InvalidValueException
from .base import BaseHandler


class TokenHandler(BaseHandler):

    @authenticated
    def get(self, user=None):
        """Return all available tokens for trading"""
        tokens = [model_to_dict(token or {}) for token in Token.select()]
        self.json_response(tokens)

    @common_authenticated
    @save_redis(field='token')
    async def post(self, user=None):
        """Add new token"""
        tokens = self.request_body

        if not tokens or not isinstance(tokens, list):
            raise InvalidValueException('Invalid payload data')

        async with self.application.objects.atomic():
            result = []
            for token in tokens:
                # required_fields = ['name', 'symbol', 'address', 'total_supply']
                obj = await self.application.objects.create(Token, **token)
                result.append(model_to_dict(obj))

            self.json_response(result)
