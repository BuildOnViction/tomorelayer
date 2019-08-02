from playhouse.shortcuts import model_to_dict
from model import Token
from util.decorator import admin_required, authenticated
from exception import InvalidValueException
from .base import BaseHandler


class TokenHandler(BaseHandler):

    @authenticated
    def get(self, user):
        """Return all available tokens for trading"""
        tokens = [model_to_dict(token or {}) for token in Token.select()]
        self.json_response(tokens)

    @authenticated
    async def post(self, user):
        """Add new token"""
        tokens = self.request_body

        if type(tokens) != list or len(tokens) == 0:
            raise InvalidValueException('Invalid payload data')

        async with self.application.objects.atomic():
            result = []
            for token in tokens:
                # required_fields = ['name', 'symbol', 'address', 'total_supply']
                obj = await self.application.objects.create(Token, **token)
                result.append(model_to_dict(obj))

            self.json_response(result)
