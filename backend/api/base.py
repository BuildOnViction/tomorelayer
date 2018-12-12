import tornado.web
import json
import traceback
import logging
import template

logger = logging.getLogger()
handler = logging.FileHandler('error.log')
formatter = logging.Formatter('%(asctime)s %(name)-12s %(levelname)-8s %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)


class BaseHandler(tornado.web.RequestHandler):
    """
    Base handler gonna to be used instead of RequestHandler
    """

    def write_error(self, status_code, **kwargs):
        self.set_header('Content-Type', 'application/json')
        traceback.print_tb(traceback.print_tb(kwargs['exc_info'][2]))

        if not self._reason:
            logger.debug(traceback.format_exception(kwargs['exc_info'][1]))

        error = {
            'code': status_code,
            'message': self._reason,
        }

        self.finish(json.dumps({'error': error}))


class ErrorHandler(tornado.web.ErrorHandler, BaseHandler):
    """
    Default handler gonna to be used in case of 404 error
    """
    pass
