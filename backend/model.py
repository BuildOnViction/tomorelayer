import peewee
from settings import database


class Relayer(peewee.Model):
    name = peewee.CharField()
    address = peewee.CharField()

    class Meta:
        database = database

    def __str__(self):
        return self.name
