from tornado.platform.asyncio import AsyncIOMainLoop
from tornado.ioloop import IOLoop
from tornado.web import Application
from route import route
from settings import settings
from api.main import NotFoundHandler
from blockchain import Blockchain


if __name__ == "__main__":
    AsyncIOMainLoop().install()
    app = Application(route, default_handler_class=NotFoundHandler, **settings)
    app.listen(settings['port'])
    app.objects = settings['objects']
    app.blockchain = Blockchain()
    IOLoop.current().start()
