from tornado.web import HTTPError
from tornado.web import authenticated
from .base import BaseHandler


class MainHandler(BaseHandler):

    @authenticated
    def get(self):
        self.render('index.html', user='vu')
