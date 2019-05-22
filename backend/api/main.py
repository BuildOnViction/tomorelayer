import json
from logzero import logger
from tornado.websocket import WebSocketHandler
from .auth import AuthSocketHandler
from .socket import SocketClient


class MainHandler(WebSocketHandler):

    socket_id = None

    def open(self, *args, **kwargs):
        """
        Client opens a websocket
        """
        logger.debug('SOCKET OPENED')
        from uuid import uuid4
        self.socket_id = str(uuid4())
        SocketClient.add(self)

    def on_message(self, message):
        """
        Message received on channel
        """
        logger.debug('Message incomming: %s', message)
        payload = json.loads(message)
        request = payload['request']

        if request == 'QR_CODE_LOGIN':
            response = AuthSocketHandler.get_qr_code(self.socket_id)
            self.write_message(response)

    def on_close(self):
        """
        Channel is closed
        """
        SocketClient.remove(self)

    def check_origin(self, origin):
        """
        Override the origin check if needed
        """
        return True

    @classmethod
    def send_message(cls, message):
        removable = set()
        for ws in SocketClient.clients:
            if not ws.ws_connection or not ws.ws_connection.stream.socket:
                SocketClient.add(ws)
            else:
                ws.write_message(message)
        for ws in removable:
            SocketClient.remove(ws)
