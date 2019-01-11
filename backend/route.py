from api.main import MainHandler
from api.registration import RegisterHandler
from api.relayer import RelayerHandler

route = [
    (r"/api", MainHandler),
    (r"/api/register", RegisterHandler),
    (r"/api/relayers", RelayerHandler),
]
