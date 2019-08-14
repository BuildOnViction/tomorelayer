import json
from os import getenv
from logzero import logger
from util.jwt_encoder import encode_payload
from util.decorator import deprecated
from exception import MissingArgumentException, UserAuthorizationException
from settings import SIGNATURE_MSG
from .base import BaseHandler
from .socket import SocketClient


class AuthHandler(BaseHandler):

    def get(self):
        from eth_account.messages import defunct_hash_message

        user_address = self.get_argument('address', None)
        signature = self.get_argument('signature', None)

        if not user_address or not signature:
            raise MissingArgumentException('Missing required argument(s)')

        web3 = self.application.blockchain.web3
        hased_message = defunct_hash_message(text=SIGNATURE_MSG)
        signing_address = web3.eth.account.recoverHash(hased_message, signature=signature)

        if signing_address.lower() != user_address.lower():
            logger.debug('Signing_addr: %s', signing_address)
            logger.debug('Provided_addr: %s', user_address)
            raise UserAuthorizationException('User Address not matching Signature Address')

        token, expiry = encode_payload({'address': user_address})
        return self.json_response({'token': token, 'exp': expiry})


    @deprecated
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
