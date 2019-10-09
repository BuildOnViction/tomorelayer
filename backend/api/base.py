import json
import traceback
from peewee import PeeweeException
from logzero import logger
from tornado.web import HTTPError, ErrorHandler as TorErrorHandler, RequestHandler
from cerberus import Validator
from settings import settings, is_production
from exception import CustomException



class CustomValidator(Validator):

    web3 = None

    def __init__(self, *args, **kwargs):
        """
        Inject ready-made web3 client
        """
        super(CustomValidator, self).__init__(*args, **kwargs)
        self.web3 = kwargs['web3']


    def _validate_is_address(self, is_address, field, value):

        if is_address and bool(value):
            try:
                address = self.web3.toChecksumAddress(value.lower())
                balance = self.web3.eth.getBalance(address)
            except Exception as err:
                self._error(field, "Not a valid address")



class BaseHandler(RequestHandler):

    validator = None

    schema = None

    request_body = None

    def __init__(self, *args, **kwargs):
        super(BaseHandler, self).__init__(*args, **kwargs)

        if self.schema:
            self.validator = CustomValidator(self.schema, purge_unknown=True, web3=self.application.blockchain.web3)

    def set_default_headers(self):
        if not is_production:
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

    def json_response(self, response='', meta=''):
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

        if isinstance(http_exception, PeeweeException):
            error['code'] = 500
            error['message'] = 'DatabaseError: {}'.format(http_exception)
            error['detail'] = self.request_body

        if settings['stg'] == 'development':
            logger.exception(http_exception)
            traceback.print_tb(stack_trace)

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
