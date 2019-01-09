from tornado.web import ErrorHandler
from tornado.web import RequestHandler
from logger import logger
import json
import traceback


class BaseHandler(RequestHandler):

    def prepare(self):
        if self.request.headers.get("Content-Type", "").startswith("application/json"):
            self.request_body = json.loads(self.request.body)
        else:
            self.request_body = None

    def json_response(self, response={}, meta={}):
        standard_resp = {
            'payload': response,
            'meta': meta,
        }
        self.write(standard_resp)

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
