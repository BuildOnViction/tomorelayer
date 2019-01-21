from api.main import MainHandler
from api.registration import RegisterHandler
from api.relayer import RelayerHandler
from api.example import TomoHandler

route = [
    (r"/api", MainHandler),
    (r"/api/register", RegisterHandler),
    (r"/api/relayers", RelayerHandler),
    (r"/api/test", TomoHandler),
]
