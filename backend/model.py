from logzero import logger
import peewee as pw
from playhouse.postgres_ext import BinaryJSONField, ArrayField
from settings import database


class PwModel(pw.Model):

    class Meta:
        database = database

    def __str__(self):
        return self.name


class Admin(PwModel):
    """
    True Owner of contract and database
    """
    name = pw.CharField(unique=True, max_length=200)
    address = pw.CharField(unique=True, max_length=200)


class Contract(PwModel):
    name = pw.CharField(max_length=200)
    address = pw.CharField(unique=True, max_length=200)
    abi = BinaryJSONField()
    obsolete = pw.BooleanField(default=False)


class Relayer(PwModel):
    owner = pw.CharField(max_length=200)
    name = pw.CharField(unique=True, max_length=200)
    coinbase = pw.CharField(unique=True, max_length=200)
    maker_fee = pw.IntegerField(default=1)
    taker_fee = pw.IntegerField(default=1)
    from_tokens = ArrayField(pw.CharField, default=[])
    to_tokens = ArrayField(pw.CharField, default=[])
    logo = pw.CharField(max_length=200, null=True)
    resigning = pw.BooleanField(default=False)


class Token(PwModel):
    name = pw.CharField(unique=True, max_length=20)
    symbol = pw.CharField(unique=True, max_length=20)
    logo = pw.CharField(max_length=255, null=True)
    address = pw.CharField(unique=True, max_length=200)
    total_supply = pw.CharField()


def loaddata():
    """Prepare some default data for database"""
    existing_tokens = Token.select()

    if existing_tokens:
        return

    # NOTE: eventually, it may requires an admin-only dashboard
    # to update this data over time
    initial_tokens = [
        {
            'name': 'Wrapped TOMO',
            'address': 'addressxxx',
            'logo': '',
            'total_supply': '10000000000000000000000000',
            'symbol': 'WTOMO',
        },
        {
            'name': 'USD-Tether',
            'address': 'yyyyyy',
            'logo': '',
            'total_supply': '99999999',
            'symbol': 'USDT',
        },
        {
            'name': 'Triip Coin',
            'address': 'zzzzzzzz',
            'logo': '',
            'total_supply': '1111111111',
            'symbol': 'TRIIP',
        },
    ]

    for token in initial_tokens:
        Token.create(**token)


database.connect()
try:
    database.create_tables([
        Admin,
        Contract,
        Relayer,
        Token,
    ])
    loaddata()
    # TODO: fetch all relayers from SmartContract if necessary
except Exception as err:
    logger.debug(err)
    logger.info('No need creating tables')
