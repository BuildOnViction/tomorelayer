from os import getenv
from logzero import logger
from tornado.ioloop import IOLoop
from tornado.web import Application
from tornado.options import options, define, parse_command_line
from route import route
from settings import settings
from blockchain import Blockchain
from api.base import NotFoundHandler

define(
    "port",
    default=8888 if getenv('STG') != 'test' else 8889,
    help="app port",
    type=int,
)

if __name__ == "__main__":
    parse_command_line()
    app = Application(route, default_handler_class=NotFoundHandler, **settings)
    app.objects = settings['objects']
    app.redis = IOLoop.current().run_sync(settings['redis'])
    logger.debug(app.redis)
    app.blockchain = Blockchain()
    logger.warning('Running on port: %s', options.port)
    app.listen(options.port)
    IOLoop.current().start()
