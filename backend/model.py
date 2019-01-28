import peewee as pw
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


class Relayer(PwModel):
    name = pw.CharField(unique=True, max_length=200)
    address = pw.CharField(unique=True, max_length=200)
    dex_rate = pw.DecimalField(max_digits=5, decimal_places=4)
    logo = pw.CharField(max_length=200)
    activated = pw.BooleanField(default=True)


database.connect()
database.create_tables([
    Admin,
    Relayer,
])
# TODO: fetch all relayers from SmartContract if necessary
