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

        # if not is_production:
        #     self.web3.middleware_stack.inject(geth_poa_middleware, layer=0)

        logger.warn('Connection status: {}'.format(self.web3.isConnected()))
