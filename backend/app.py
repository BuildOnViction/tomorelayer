from os import getenv
from logzero import logger
from tornado.ioloop import IOLoop
from tornado.web import Application
from tornado.options import options, define, parse_command_line
from route import route
from settings import settings
from blockchain import Blockchain
from api.base import NotFoundHandler
from tornado_crontab import crontab

define(
    "port",
    default=8888 if getenv('STG') != 'test' else 8889,
    help="app port",
    type=int,
)

@crontab("* * * * *")
def updateRelayers():
    logger.info('Run updateRelayers crontab')
    blockchain = Blockchain()
    blockchain.updateRelayers()

if __name__ == "__main__":
    parse_command_line()
    app = Application(route, default_handler_class=NotFoundHandler, **settings)
    app.objects = settings['objects']
    app.blockchain = Blockchain()
    app.blockchain.updateRelayers()
    logger.warning('Running on port: %s', options.port)
    updateRelayers()
    app.listen(options.port)
    try:
        IOLoop.current().start()
    except KeyboardInterrupt:
        IOLoop.current().stop()
