from os import getenv
import json
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
            'type': 'QR_CODE_LOGIN',
            'meta': {
                'conn_id': conn_id,
                'address': signer_address,
                'signature': signature,
            }
        })
        conn.write_message(payload)


class AuthSocketHandler():

    @staticmethod
    def get_qr_code(identity):
        from datetime import datetime
        message = '[Relayer {}] Login'.format(datetime.now().strftime('%x %H-%M-%S'))
        tunnel = getenv('TUNNEL_URL', '')
        url = '{tunnel}/api/auth?verifyId={identity}'.format(tunnel=tunnel, identity=identity)

        return json.dumps({
            'type': 'QR_CODE_REQUEST',
            'meta': {
                'message': message,
                'id': identity,
                'url': url,
            }
        })
