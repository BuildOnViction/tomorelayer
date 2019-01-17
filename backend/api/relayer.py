from model import Relayer
from .base import BaseHandler


class RelayerHandler(BaseHandler):

    async def get(self):
        query = await self.application.objects.execute(Relayer.select().dicts())
        relayers = []

        for r in query:
            relayers.append(r)

        for r in relayers:
            r['dex_rate'] = float(r['dex_rate'])

        self.json_response(relayers)
