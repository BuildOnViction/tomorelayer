from api.base import BaseHandler
from util.decorator import admin_required


class RedisHandler(BaseHandler):

    @admin_required
    async def get(self):
        redis = self.application.redis
        action = self.get_argument('action', None)

        if action == 'flush':
            await redis.flushall()
            return self.write('redis flushed successfully')

        return self.write('No action')
