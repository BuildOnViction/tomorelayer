from api.main import MainHandler
from api.authorization import RegisterHandler

route = [
    (r"/api", MainHandler),
    (r"/api/register", RegisterHandler),
]
