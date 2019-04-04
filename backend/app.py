import os
from tornado.platform.asyncio import AsyncIOMainLoop
from tornado import httpserver
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
    current_dir = os.getcwd()

    ssl_options = {
        "certfile": os.path.join(current_dir, "backend/cert/localhost.crt"),
        "keyfile": os.path.join(current_dir, "backend/cert/localhost.key"),
    }

    app = Application(route, default_handler_class=NotFoundHandler, ssl_options=ssl_options, **settings)
    app.objects = settings['objects']
    app.blockchain = Blockchain()
    # http_server = httpserver.HTTPServer(app, ssl_options=ssl_options)
    app.listen(options.port)
    IOLoop.current().start()
