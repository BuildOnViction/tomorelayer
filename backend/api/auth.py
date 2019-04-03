from settings import base_url
from .base import BaseHandler


class AuthHandler(BaseHandler):

    def get(self):
        """Provide QR code when requested
        """
        if self.get_argument('qr_code', None):
            agent_query = self.get_argument('qr_code')
            qr = self.generate_qr_code()
            return self.json_response(qr)

    def post(self):
        """Receiving request from TomoWallet"""
        print(self.request_body)
        breakpoint()

    def generate_qr_code(self):
        from datetime import datetime
        from uuid import uuid4
        message = '[Relayer {}] Login'.format(datetime.now().strftime('%x %H-%M-%S'))
        identity = str(uuid4())
        qrcode = '{base_url}/api/auth?verifyId={identity}'.format(
            base_url=base_url,
            identity=identity,
        )

        return {
            'message': message,
            'id': identity,
            'qrcode': qrcode,
        }
