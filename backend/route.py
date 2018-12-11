from tornado.web import RequestHandler


class MainHandler(RequestHandler):
    def get(self):
        self.render("template/index.html")


class Default404Handler(RequestHandler):
    def prepare(self):
        self.set_status(404)
        self.render("template/404.html")


route = [
    (r"/", MainHandler)
]
