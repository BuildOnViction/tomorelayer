from tornado.platform.asyncio import AsyncIOMainLoop
from tornado.ioloop import IOLoop
from logzero import logger
from tornado.web import Application
from tornado.options import options
from tornado.options import define
from tornado.options import parse_command_line
from route import route
from settings import settings
from blockchain import Blockchain
from api.base import NotFoundHandler

define("port", default=8888, help="app port", type=int)

if __name__ == "__main__":
    parse_command_line()
    AsyncIOMainLoop().install()
    app = Application(route, default_handler_class=NotFoundHandler, **settings)
    app.objects = settings['objects']
    app.blockchain = Blockchain()
    logger.warning('Running on port: %s', options.port)
    app.listen(options.port)
    IOLoop.current().start()
