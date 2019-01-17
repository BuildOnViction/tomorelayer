import peewee as pw
from settings import database


class Relayer(pw.Model):
    name = pw.CharField(unique=True, max_length=200)
    address = pw.CharField(unique=True, max_length=200)
    dex_rate = pw.DecimalField(max_digits=5, decimal_places=4)
    logo = pw.CharField(max_length=200)

    class Meta:
        database = database

    def __str__(self):
        return self.name


database.connect()
database.create_tables([Relayer])
