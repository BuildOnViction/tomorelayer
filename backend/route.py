from api.main import MainHandler
from api.test import TestHandler

route = [
    (r"/", MainHandler),
    (r"/t", TestHandler),
]
