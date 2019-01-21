import json
import tornado.autoreload
from os import getenv
from web3 import Web3
from web3.middleware import geth_poa_middleware
from logzero import logger

is_production = getenv('STG') == 'production'


class Blockchain:

    web3 = None
    contracts = None
    relayer_contract = None

    def __init__(self):
        """ Interact with Blockchain through SmartContract & WebSocket
        """
        self.web3 = Web3()
        self.read_local_contracts()
        self.web3.eth.defaultAccount = self.web3.eth.accounts[0]

        if not is_production:
            self.web3.middleware_stack.inject(geth_poa_middleware, layer=0)

        logger.warn('Connection status: {}'.format(self.web3.isConnected()))

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

                # FIXME: can't use a hard-coded contract name for future modifications/upgrades
                # watch for a environment variable contract_name?
                contract_name = 'Official_TomoChain_Relayer_Registration'
                for c in self.contracts:
                    if c['className'] == contract_name:
                        abi = c['abiDefinition']
                        address = c['deployedAddress']
                        self.relayer_contract = self.web3.eth.contract(address=address, abi=abi)

        except Exception:
            logger.error('Cannot read contracts.json')
            logger.error('Make sure you have already compiled all the necessary contracts with Embark')
