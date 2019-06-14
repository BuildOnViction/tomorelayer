from playhouse.shortcuts import model_to_dict
from model import Token
from .base import BaseHandler


class TokenHandler(BaseHandler):

    def get(self):
        """Return all available tokens for trading"""
        tokens = []
        try:
            tokens = [model_to_dict(token or {}) for token in Token.select()]
        except Exception:
            # No Token in DB yet
            pass

        self.json_response(tokens)


    async def post(self):
        """Add new token"""
        tokens = self.request_body.get('tokens', [])
        response = []

        async with self.application.objects.atomic():
            for token in tokens:
                obj = await self.application.objects.create(Token, **token)
                response.append({
                    'id': obj.id,
                    'name': obj.name,
                    'symbol': obj.symbol,
                    'logo': obj.logo,
                    'address': obj.address.lower(),
                    'total_supply': obj.total_supply,
                })

        all_tokens = [model_to_dict(token or {}) for token in Token.select()]
        self.json_response(all_tokens)
