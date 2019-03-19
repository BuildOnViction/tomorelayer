from api.main import MainHandler
from api.authen import AuthHandler
# from api.contract import ContractHandler
# from api.registration import RegisterHandler
# from api.relayer import RelayerHandler
# from api.example import TomoHandler

route = [
    (r"/", MainHandler),
    (r"/login", AuthHandler),
    # (r"/api/contracts", ContractHandler),
    # (r"/api/register", RegisterHandler),
    # (r"/api/relayers", RelayerHandler),
    # (r"/api/test", TomoHandler),
]
