from tornado.web import HTTPError
from .base import BaseHandler


class TestHandler(BaseHandler):
    def get(self):
        msg = 'FUCK SHIT'
        code = 401
        raise HTTPError(status_code=code, reason=msg)
