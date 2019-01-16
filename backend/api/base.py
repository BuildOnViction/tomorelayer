from tornado.web import ErrorHandler
from tornado.web import RequestHandler
from peewee import IntegrityError
from logger import logger
from exception import *
import json
import traceback


class BaseHandler(RequestHandler):

    def prepare(self):
        if self.request.headers.get("Content-Type", "").startswith("application/json"):
            self.request_body = json.loads(self.request.body)
        else:
            self.request_body = None

    def json_response(self, response={}, meta={}):
        self.set_header('Content-Type', 'application/json')
        self.set_header('Access-Control-Allow-Origin', '*')
        standard_resp = {
            'payload': response,
            'meta': meta,
        }
        self.write(standard_resp)

    def write_error(self, status_code, **kwargs):
        self.set_header('Content-Type', 'application/json')
        _, http_exception, stack_trace = kwargs['exc_info']

        is_integrity_error = isinstance(http_exception, IntegrityError)
        is_custom_error = isinstance(http_exception, CustomException)
        is_uncaught_error = status_code == 500 and not is_integrity_error

        error = {
            'code': status_code,
            'message': self._reason,
            'detail': str(http_exception),
        }

        if is_uncaught_error:
            # Something wrong with server's handler
            logger.exception(http_exception)
            traceback.print_tb(stack_trace)

        if is_custom_error:
            error['code'] = http_exception.status_code
            error['message'] = http_exception.message
            error['detail'] = http_exception.detail

        if is_integrity_error:
            message, detail, _ = str(http_exception).split('\n')
            error['code'] = 400
            error['message'] = message
            error['detail'] = detail.replace('DETAIL:  ', '')

        self.finish(json.dumps({'error': error}))


class ErrorHandler(ErrorHandler, BaseHandler):
    """
    Default handler to be used in case of 404 error
    """
    pass
