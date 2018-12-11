from tornado.ioloop import IOLoop
from tornado.web import Application
from route import route
from settings import settings


if __name__ == "__main__":
    app = Application(route, **settings)
    app.listen(settings['port'])
    IOLoop.current().start()
