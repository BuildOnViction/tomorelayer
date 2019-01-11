from tornado.web import HTTPError
from .base import BaseHandler


class MainHandler(BaseHandler):
    def get(self):
        self.json_response('Congratulation! API established properly!')


class NotFoundHandler(BaseHandler):

    def prepare(self):
        raise HTTPError(
            status_code=404,
            reason="Invalid api endpoint.",
        )
