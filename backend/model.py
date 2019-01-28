import peewee as pw
from playhouse.postgres_ext import BinaryJSONField
from settings import database


class PwModel(pw.Model):

    class Meta:
        database = database

    def __str__(self):
        return self.name


class DelegateAccount(PwModel):
    """
    Accounts that Backend has complete control over
    They are created on server initialization or by requested
    Real owner of the contract may need deposit some fund to the DelegateAccount
    so it can make transactions
    """
    name = pw.CharField(unique=True, max_length=200)
    address = pw.CharField(unique=True, max_length=200)
    network = pw.CharField(unique=True, max_length=200)


class Contract(PwModel):
    """
    Stored contract abi and bytecode
    they can be swapped over in case of contract change/upgrade
    """
    name = pw.CharField(unique=True, max_length=200)
    address = pw.CharField(unique=True, max_length=200)
    abi = BinaryJSONField()
    bytecode = BinaryJSONField()


class Relayer(PwModel):
    name = pw.CharField(unique=True, max_length=200)
    address = pw.CharField(unique=True, max_length=200)
    dex_rate = pw.DecimalField(max_digits=5, decimal_places=4)
    logo = pw.CharField(max_length=200)
    activated = pw.BooleanField(default=True)


database.connect()
database.create_tables([
    DelegateAccount,
    Contract,
    Relayer,
])
# TODO: fetch all relayers from SmartContract if necessary
