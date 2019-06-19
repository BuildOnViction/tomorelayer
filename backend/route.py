from api.main import MainHandler
from api.auth import AuthHandler
from api.token import TokenHandler
from api.relayer import RelayerHandler
from api.contract import ContractHandler

route = [
    (r"/socket", MainHandler),
    (r"/api/auth", AuthHandler), # reserved for mobile/external interaction other than socket channels
    (r"/api/contract", ContractHandler),
    (r"/api/relayer", RelayerHandler),
    (r"/api/token", TokenHandler),
]
