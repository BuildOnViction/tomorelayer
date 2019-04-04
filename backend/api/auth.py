import json
from settings import base_url
from .base import BaseHandler
from .socket import SocketClient


class AuthHandler(BaseHandler):

    def post(self):
        """Receiving request from TomoWallet"""
        conn_id = self.get_argument('verifyId', '')
        signer_address = self.request_body['signer'].lower()
        signature = self.request_body['signature'].lower()
        conn = SocketClient.retrieve(conn_id)
        payload = json.dumps({
            'conn_id': conn_id,
            'address': signer_address,
        })
        conn.write_message(payload)


class AuthSocketHandler():

    @staticmethod
    def get_qr_code(request, meta, identity):
        from datetime import datetime
        message = '[Relayer {}] Login'.format(datetime.now().strftime('%x %H-%M-%S'))
        url = '{base_url}/api/auth?verifyId={identity}'.format(
            base_url=base_url,
            identity=identity,
        )

        return json.dumps({
            'message': message,
            'id': identity,
            'url': url,
        })
