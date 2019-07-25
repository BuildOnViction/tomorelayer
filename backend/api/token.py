from playhouse.shortcuts import model_to_dict
from model import Token
from util.decorator import admin_required
from .base import BaseHandler


class TokenHandler(BaseHandler):

    def get(self):
        """Return all available tokens for trading"""
        tokens = [model_to_dict(token or {}) for token in Token.select()]
        self.json_response(tokens)

    @admin_required
    async def post(self):
        """Add new token"""
        token = self.request_body
        obj = await self.application.objects.create(Token, **token)
        self.json_response(model_to_dict(obj))
