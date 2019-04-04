from api.main import MainHandler
from api.auth import AuthHandler

route = [
    (r"/socket", MainHandler),
    (r"/api/auth", AuthHandler), # reserved for mobile/external interaction other than socket channels
]
