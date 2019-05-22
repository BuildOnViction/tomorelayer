import json
import traceback
from tornado.web import HTTPError
from tornado.web import ErrorHandler as TorErrorHandler
from tornado.web import RequestHandler
from peewee import IntegrityError
from logger import logger
from settings import settings, is_production
from exception import *


class BaseHandler(RequestHandler):
    request_body = None

    def set_default_headers(self):
        if not is_production:
            self.set_header("Access-Control-Allow-Origin", "*")

    def get_current_user(self):
        return self.get_secure_cookie('user_id')

    def prepare(self):
        content_type = self.request.headers.get("Content-Type", "")
        jsontype, textplain = "application/json", "text/plain"
        valid_content_type = jsontype in content_type or textplain in content_type

        if valid_content_type:
            self.request_body = json.loads(self.request.body)

    def json_response(self, response={}, meta={}):
        standard_resp = {
            'payload': response,
            'meta': meta,
        }
        self.write(standard_resp)

    def write_error(self, status_code, **kwargs):
        _, http_exception, stack_trace = kwargs['exc_info']

        is_integrity_error = isinstance(http_exception, IntegrityError)
        is_custom_error = isinstance(http_exception, CustomException)
        is_uncaught_error = status_code == 500 and not is_integrity_error and not is_custom_error

        error = {
            'code': status_code,
            'message': self._reason,
            'detail': str(http_exception),
        }

        if is_uncaught_error:
            # Something wrong with server's handler
            logger.exception(http_exception)
            traceback.print_tb(stack_trace)
            if settings['stg'] == 'development':
                breakpoint()

        if is_custom_error:
            error['code'] = http_exception.status_code
            error['message'] = http_exception.message
            error['detail'] = http_exception.detail

        if is_integrity_error:
            # FIXME: handle all peewee error in one-separete handler
            message, detail, _ = str(http_exception).split('\n')
            error['code'] = 400
            error['message'] = message
            error['detail'] = detail.replace('DETAIL:  ', '')

        self.set_status(error['code'])
        self.finish(json.dumps({'error': error}))


class ErrorHandler(TorErrorHandler, BaseHandler):
    """
    Default handler to be used in case of 404 error
    """


class NotFoundHandler(BaseHandler):

    def prepare(self):
        raise HTTPError(
            status_code=404,
            reason="Invalid api endpoint.",
        )
