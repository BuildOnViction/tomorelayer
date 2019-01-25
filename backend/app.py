from tornado.platform.asyncio import AsyncIOMainLoop
from tornado.ioloop import IOLoop
from tornado.web import Application
from tornado.options import options
from tornado.options import define
from route import route
from settings import settings
from blockchain import Blockchain
from api.base import NotFoundHandler

define("port", default=3000, help="app port", type=int)

if __name__ == "__main__":
    options.parse_command_line()
    AsyncIOMainLoop().install()
    app = Application(route, default_handler_class=NotFoundHandler, **settings)
    app.listen(options.port or settings['port'])
    app.objects = settings['objects']
    app.blockchain = Blockchain()
    IOLoop.current().start()
