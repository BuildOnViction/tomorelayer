import json
from tornado.web import HTTPError
from .base import BaseHandler


class NotFoundHandler(BaseHandler):

    def prepare(self):
        raise HTTPError(
            status_code=404,
            reason="Invalid api endpoint.",
        )
