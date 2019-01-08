from tornado.web import ErrorHandler
from tornado.web import RequestHandler
from logger import logger
import json
import traceback


class BaseHandler(RequestHandler):
    def write_error(self, status_code, **kwargs):
        self.set_header('Content-Type', 'application/json')
        _, http_exception, stack_trace = kwargs['exc_info']

        if status_code == 500:
            # Something wrong with server's handler
            logger.exception(http_exception)
            traceback.print_tb(stack_trace)

        error = {'code': status_code, 'message': self._reason}
        self.finish(json.dumps({'error': error}))


class ErrorHandler(ErrorHandler, BaseHandler):
    """
    Default handler to be used in case of 404 error
    """
    pass
