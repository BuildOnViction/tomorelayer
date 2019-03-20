from settings import base_url
from .base import BaseHandler


class AuthHandler(BaseHandler):

    def get(self):
        """Provide QR code when requested
        """
        if self.get_argument('qr_code', None, True):
            qr = self.generate_qr_code()
            return self.json_response(qr)

    def generate_qr_code(self):
        from datetime import datetime
        from uuid import uuid4
        message = '[Relayer {}] Login'.format(datetime.now().strftime('%x %H-%M-%S'))
        identity = str(uuid4())
        qr_code = {
            'message': message,
            'id': identity,
            'qrcode': base_url + '/api/auth?verifyId={}'.format(identity),
        }
        return qr_code
