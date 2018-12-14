import json
from .base import BaseHandler


class MainHandler(BaseHandler):
    def get(self):
        self.finish(json.dumps({'error': None}))
