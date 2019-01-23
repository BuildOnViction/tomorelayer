import os
import json
import tornado.autoreload
from web3 import Web3
from web3.middleware import geth_poa_middleware
from logzero import logger

is_production = os.getenv('STG') == 'production'


class Blockchain:

    web3 = None
    contracts = {}
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
        """ READ JSON FILES OF COMPILED CONTRACTS
        """
        try:
            contract_files = os.listdir('build/contracts')
            for file_name in contract_files:
                file = 'build/contracts/' + file_name

                with open(file) as json_file:
                    contract_dict = json.load(json_file)
                    contract_name = contract_dict['className']
                    self.contracts[contract_name] = contract_dict
                    tornado.autoreload.watch(file)

            registration_contract = os.getenv('CONTRACT_REGISTRATION_NAME')
            abi = self.contracts[registration_contract]['abiDefinition']
            address = self.contracts[registration_contract]['deployedAddress']
            self.relayer_contract = self.web3.eth.contract(address=address, abi=abi)

            logger.info('Loaded all the contract data')
            logger.info('Watching contract json files for changes')
            tornado.autoreload.add_reload_hook(lambda: logger.warn('Reloading...'))

        except Exception as err:
            logger.error(err)
            logger.error('Cannot read compiled contract data')
            logger.error('Make sure you have already compiled all the necessary contracts with Embark')
