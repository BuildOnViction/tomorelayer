from os import getenv
from logzero import logger
from tornado.ioloop import IOLoop
from tornado.web import Application
from route import route
from settings import settings
from blockchain import Blockchain
from api.base import NotFoundHandler
from tornado_crontab import crontab

@crontab("* * * * *")
def updateRelayers():
    logger.info('Run updateRelayers crontab')
    app.blockchain.updateRelayers()

if __name__ == "__main__":
    app = Application(route, default_handler_class=NotFoundHandler, **settings)
    app.objects = settings['objects']
    app.blockchain = Blockchain()
    app.blockchain.updateRelayers()
    updateRelayers()
    try:
        IOLoop.current().start()
    except KeyboardInterrupt:
        IOLoop.current().stop()
