from api.main import MainHandler
from api.test import TestHandler
from api.test import AsyncHandler

route = [
    (r"/api", MainHandler),
    (r"/api/t", TestHandler),
    (r"/api/test", AsyncHandler),
]
