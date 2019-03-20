from settings import base_url
from .base import BaseHandler


class AuthHandler(BaseHandler):

    def get(self):
        """Provide QR code when requested
        """
        if self.get_argument('qr_code', None):
            agent_query = self.get_argument('qr_code')
            qr = self.generate_qr_code(agent_query)
            return self.json_response(qr)

    def generate_qr_code(self, agent):
        from datetime import datetime
        from uuid import uuid4
        message = '[Relayer {}] Login'.format(datetime.now().strftime('%x %H-%M-%S'))
        identity = str(uuid4())
        qrcode = '{agent}://{base_url}/api/auth?verifyId={identity}'.format(
            agent=agent,
            base_url=base_url,
            identity=identity,
        )

        return {
            'message': message,
            'id': identity,
            'qrcode': qrcode,
        }
