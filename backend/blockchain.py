import os
from web3 import Web3
from logzero import logger

is_production = os.getenv('STG') == 'production'


class Blockchain:

    web3 = None

    def __init__(self):
        """ Interact with Blockchain through SmartContract & WebSocket
        """
        self.web3 = Web3()
        logger.info('Connection status: {}'.format(self.web3.isConnected()))
        logger.info('Connection name: {}'.format(self.web3.clientVersion))
