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
        logger.info('Web3 URI: %s', os.getenv('WEB3_PROVIDER_URI'))
        logger.info('Chain connection status: %s', self.web3.isConnected())
        logger.info('Node name: %s', self.web3.clientVersion)
