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


database.connect()
try:
    database.create_tables([
        Admin,
        Contract,
        Relayer,
    ])
except Exception:
    logger.info('No need creating tables')
# TODO: fetch all relayers from SmartContract if necessary
