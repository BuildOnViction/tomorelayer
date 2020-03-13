import os
from playhouse.shortcuts import model_to_dict
from web3.auto import w3
from logzero import logger
from model import Contract

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

    def getRelayerByCoinbase(self, coinbase):
        contract = model_to_dict(Contract.select().where(Contract.name == 'RelayerRegistration').get())
        c = self.web3.eth.contract(address=contract['address'], abi=contract['abi'])
        relayer = c.functions.getRelayerByCoinbase(self.web3.toChecksumAddress(coinbase)).call()
        logger.info('Relayer %s', relayer)
        return relayer
