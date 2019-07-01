import json
import traceback
from tornado.web import HTTPError
from tornado.web import ErrorHandler as TorErrorHandler
from tornado.web import RequestHandler
from peewee import PeeweeException
from logzero import logger
from settings import settings, is_production
from exception import *


class BaseHandler(RequestHandler):
    request_body = None

    def set_default_headers(self):
        if not is_production:
            # FIXME: for production, cant allow CORS
            self.set_header("Access-Control-Allow-Origin", "*")

        self.set_header("Access-Control-Allow-Headers", "access-control-allow-origin,authorization,content-type,x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS')

    def get_current_user(self):
        return self.get_secure_cookie('user_id')

    def prepare(self):
        content_type = self.request.headers.get("Content-Type", "")
        jsontype, textplain = "application/json", "text/plain"
        valid_content_type = jsontype in content_type or textplain in content_type

        if valid_content_type:
            self.request_body = json.loads(self.request.body)

    def options(self):
        self.set_status(204)
        self.finish()

    def json_response(self, response={}, meta={}):
        standard_resp = {
            'payload': response,
            'meta': meta,
        }
        self.write(standard_resp)

    def write_error(self, status_code, **kwargs):
        _, http_exception, stack_trace = kwargs['exc_info']

        error = {
            'code': status_code,
            'message': self._reason,
            'detail': str(http_exception),
        }

        if isinstance(http_exception, CustomException):
            error['code'] = http_exception.status_code
            error['message'] = http_exception.message
            error['detail'] = http_exception.detail

        elif isinstance(http_exception, PeeweeException):
            error['code'] = 500
            error['message'] = 'DatabaseError: {}'.format(http_exception)
            error['detail'] = self.request_body

        elif isinstance(http_exception, LookupError):
            error['code'] = 500
            error['message'] = 'LookupError: {}'.format(http_exception)
            error['detail'] = self.request_body

        else:
            logger.exception(http_exception)
            traceback.print_tb(stack_trace)
            # TODO: report...
            if settings['stg'] == 'development':
                breakpoint()

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
