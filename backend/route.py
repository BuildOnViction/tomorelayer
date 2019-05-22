from api.main import MainHandler
from api.auth import AuthHandler
from api.token import TokenHandler
from api.relayer import RelayerHandler

route = [
    (r"/socket", MainHandler),
    (r"/api/auth", AuthHandler), # reserved for mobile/external interaction other than socket channels
    (r"/api/token", TokenHandler), # tokens CRUD endpoint
    (r"/api/relayer", RelayerHandler),
]
