import os
from tornado.ioloop import IOLoop
from tornado.web import Application
from route import route, Default404Handler


if __name__ == "__main__":
    port = os.getenv('BE_PORT')
    stg = os.getenv('STG')

    if stg != 'production':
        print('APP_PORT:' + port)
        print('APP_STAGE:' + stg)

    app = Application(route, default_handler_class=Default404Handler)
    app.listen(port)
    IOLoop.current().start()
