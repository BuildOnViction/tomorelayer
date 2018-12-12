from tornado.web import ErrorHandler
from tornado.web import RequestHandler
import json
import traceback


class BaseHandler(RequestHandler):
    def write_error(self, status_code, **kwargs):
        self.set_header('Content-Type', 'application/json')
        _, http_exception, stack_trace = kwargs['exc_info']
        traceback.print_tb(stack_trace)
        # Log the unreasoned errors
        error = {'code': status_code, 'message': self._reason}
        self.finish(json.dumps({'error': error}))


class ErrorHandler(ErrorHandler, BaseHandler):
    """
    Default handler gonna to be used in case of 404 error
    """
    pass
