from logzero import logger
import peewee as pw
from playhouse.postgres_ext import BinaryJSONField, ArrayField
from settings import database


class PwModel(pw.Model):

    class Meta:
        database = database
        only_save_dirty = True

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
    link = pw.CharField(max_length=255, null=True)
    resigning = pw.BooleanField(default=False)
    lock_time = pw.IntegerField(null=True)


class Token(PwModel):
    name = pw.CharField(unique=True, max_length=20)
    symbol = pw.CharField(unique=True, max_length=20)
    logo = pw.CharField(null=True)
    address = pw.CharField(unique=True, max_length=200)
    total_supply = pw.CharField()
    is_major = pw.BooleanField(default=False)


def loaddata():
    """Prepare some default data for database"""
    existing_tokens = Token.select()

    if existing_tokens:
        return

    # NOTE: eventually, it may requires an admin-only dashboard
    # to update this data over time
    initial_tokens = [
        {
            'name': 'TOMO',
            'address': '0x504812e482877a37b1998df30f78d5e79c836f51',
            'logo': '',
            'total_supply': '10000000000000000000000000',
            'symbol': 'TOMO',
        },
        {
            'name': 'USD-Tether',
            'address': '0x9e9d3d79e9f73806999e0ca601f23b701b97bc46',
            'logo': '',
            'total_supply': '2000000',
            'symbol': 'USDT',
        },
        {
            'name': 'TriipProtocol',
            'address': '0x330f02cd0ae9fd8c2d4e33e9c1d6e047b8a56f58',
            'logo': '',
            'total_supply': '2000000',
            'symbol': 'TRIIP',
        },
        {
            'name': 'Ethereum',
            'address': '0x606fc6ccf4979df479a7fa0a00e8a809728f18ed',
            'logo': '',
            'total_supply': '2000000',
            'symbol': 'ETH',
        },
        {
            'name': 'Bitcoin',
            'address': '0x579798b0bf809e9b4a5e554d16011db04a6af340',
            'logo': '',
            'total_supply': '2000000',
            'symbol': 'BTC',
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
except Exception as err:
    logger.debug(err)
    logger.info('No need creating tables')
