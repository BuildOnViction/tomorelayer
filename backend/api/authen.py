from settings import base_url
from util.decorator import json_header
from logzero import logger
from .base import BaseHandler


class AuthHandler(BaseHandler):

    def get(self):
        """Show login page, also provide QR code when requested
        """
        if self.get_argument('qr_code', None, True):
            qr = self.generate_qr_code()
            logger.info(qr)
            return self.json_response(self.generate_qr_code())

        self.render('login.html')

    @json_header
    def generate_qr_code(self):
        from datetime import datetime
        from uuid import uuid4
        message = '[Relayer {}] Login'.format(datetime.now().strftime('%x %H-%M-%S'))
        id = str(uuid4())
        qr_code = {
            'message': message,
            'id': id,
            'url': base_url + '/api/auth?verifyId={}'.format(id),
        }
        return qr_code
