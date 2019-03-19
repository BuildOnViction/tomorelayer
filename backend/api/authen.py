from settings import base_url
from .base import BaseHandler


class AuthHandler(BaseHandler):

    def get(self):
        """Generate QR code
        """
        from datetime import datetime
        from uuid import uuid4
        message = '[Relayer {}] Login'.format(datetime.now().strftime('%x %H-%M-%S'))
        id = str(uuid4())
        embedded_qr_code = {
            'message': message,
            'id': id,
            'url': base_url + '/api/auth?verifyId={}'.format(id),
        }
        self.render('login.html', qr=embedded_qr_code)

    def post(self):
        """verify id
        """
        pass
