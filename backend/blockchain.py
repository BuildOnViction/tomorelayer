import os
from web3.auto import w3
from logzero import logger

is_production = os.getenv('STG') == 'production'


class Blockchain:

    web3 = None

    def __init__(self):
        """ Interact with Blockchain through SmartContract & WebSocket
        """
        self.web3 = w3
        logger.info('Connection status: %s', self.web3.isConnected())
        logger.info('Connection name: %s', self.web3.version.node)
