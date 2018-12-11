from tornado.web import HTTPError
from .base import BaseHandler


class TestHandler(BaseHandler):
    def get(self):
        msg = 'FUCK SHIT'
        code = 500
        raise HTTPError(status_code=code, log_message=msg)
