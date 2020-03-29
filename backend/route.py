from tornado.routing import HostMatches
from api.main import SocketHandler
from api.auth import AuthHandler
from api.token import TokenHandler
from api.relayer import RelayerHandler
from api.public import PublicHandler
# from api.mailer import MailHandler

# HostMatches
ALLOWED_HOSTS = HostMatches(r'.*(tomochain.com|localhost)')

route = [(ALLOWED_HOSTS, [
    ("/socket", SocketHandler),
    # reserved for mobile/external interaction other than socket channels
    ("/api/auth", AuthHandler),
    ("/api/relayer", RelayerHandler),
    ("/api/token", TokenHandler),
    ("/api/public", PublicHandler),
])]
