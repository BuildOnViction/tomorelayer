from tornado.platform.asyncio import AsyncIOMainLoop
from tornado.ioloop import IOLoop
from tornado.web import Application
from tornado.options import options
from tornado.options import define
from tornado.options import parse_command_line
from route import route
from settings import settings
from blockchain import Blockchain
from api.base import NotFoundHandler

define("port", default=settings['port'], help="app port", type=int)

if __name__ == "__main__":
    parse_command_line()
    AsyncIOMainLoop().install()
    APP = Application(route, default_handler_class=NotFoundHandler, **settings)
    APP.listen(options.port)
    APP.objects = settings['objects']
    APP.blockchain = Blockchain()
    IOLoop.current().start()
