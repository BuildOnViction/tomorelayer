from logzero import logger
import peewee as pw
from playhouse.postgres_ext import BinaryJSONField
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
    name = pw.CharField(unique=True, max_length=200)
    address = pw.CharField(unique=True, max_length=200)
    dex_rate = pw.IntegerField(default=0)
    foundation_rate = pw.IntegerField(default=0)
    logo = pw.CharField(max_length=200)
    activated = pw.BooleanField(default=True)


class Token(PwModel):
    name = pw.CharField(unique=True, max_length=20)
    symbol = pw.CharField(unique=True, max_length=20)
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
            'total_supply': '10000000000000000000000000',
            'symbol': 'WTOMO',
        },
        {
            'name': 'USD-Tether',
            'address': 'yyyyyy',
            'total_supply': '99999999',
            'symbol': 'USDT',
        },
        {
            'name': 'Triip Coin',
            'address': 'zzzzzzzz',
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
except Exception:
    logger.info('No need creating tables')
# TODO: fetch all relayers from SmartContract if necessary
