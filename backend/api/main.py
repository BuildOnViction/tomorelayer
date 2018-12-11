from .base import BaseHandler
import template


class MainHandler(BaseHandler):
    def get(self):
        self.render(template.INDEX)
