from tornado.routing import HostMatches
from api.main import MainHandler
from api.auth import AuthHandler
from api.token import TokenHandler
from api.relayer import RelayerHandler
from api.contract import ContractHandler
from api.public import PublicHandler
from api.redis import RedisHandler

# HostMatches
ALLOWED_HOSTS = HostMatches(r'.*(tomochain.com|localhost)')

route = [(ALLOWED_HOSTS, [
    ("/socket", MainHandler),
    ("/api/auth", AuthHandler), # reserved for mobile/external interaction other than socket channels
    ("/api/contract", ContractHandler),
    ("/api/relayer", RelayerHandler),
    ("/api/token", TokenHandler),
    ("/api/public", PublicHandler),
    ("/api/redis", RedisHandler),
])]
