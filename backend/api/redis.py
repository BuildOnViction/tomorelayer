from api.base import BaseHandler
from util.decorator import admin_required


class RedisHandler(BaseHandler):

    @admin_required
    async def get(self):
        redis = self.application.redis
        action = self.get_argument('action', None)

        if action == 'flush':
            await redis.flushall()
            self.json_response()
        else:
            self.write('No action')