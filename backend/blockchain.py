import json
import tornado.autoreload
from os import getenv
from web3 import Web3
# from web3 import WebsocketProvider
from web3 import HTTPProvider
from web3.middleware import geth_poa_middleware
from logzero import logger

is_production = getenv('STG') == 'production'


class Blockchain:

    contracts = None
    web3 = None

    def __init__(self):
        """ Interact with Blockchain through SmartContract & WebSocket
        """
        socketProvider = getenv('TMC_EPC')
        self.read_local_contracts()
        # TODO: find a way to change to WebSocketProvider later
        self.web3 = Web3(HTTPProvider(socketProvider))

        if not is_production:
            self.web3.middleware_stack.inject(geth_poa_middleware, layer=0)

    def read_local_contracts(self):
        """ READ a friendly contracts.json
        """
        try:
            with open('contracts.json') as json_file:
                self.contracts = json.load(json_file)
                logger.info('Loaded all the contract data')

                logger.info('Watching contracts.json for changes')
                tornado.autoreload.watch('contracts.json')
                tornado.autoreload.add_reload_hook(lambda: logger.warn('Reloading...'))

        except Exception:
            logger.error('Cannot read contracts.json')
            logger.error('Make sure you have already compiled all the necessary contracts with Embark')
