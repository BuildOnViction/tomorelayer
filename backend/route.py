from api.main import MainHandler
from api.test import TestHandler
from api.test import AsyncHandler

route = [
    (r"/", MainHandler),
    (r"/t", TestHandler),
    (r"/test", AsyncHandler),
]
