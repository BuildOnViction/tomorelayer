import tornado.web
import template


class BaseHandler(tornado.web.RequestHandler):
    """
    Base handler gonna to be used instead of RequestHandler
    """

    def write_error(self, status_code, **kwargs):
        if status_code == 404:
            self.render(template._404)
        else:
            self.set_status(status_code)
            error = kwargs['exc_info']
            import pdb
            pdb.set_trace()

            print(error)


class ErrorHandler(tornado.web.ErrorHandler, BaseHandler):
    """
    Default handler gonna to be used in case of 404 error
    """
    pass
