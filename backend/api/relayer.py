from model import Relayer
from .base import BaseHandler


class RelayerHandler(BaseHandler):

    async def get(self):
        relayers = await self.application.objects.execute(Relayer.select().dicts())
        self.json_response(relayers)
