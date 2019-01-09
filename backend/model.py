import peewee as pw
from settings import database


class Relayer(pw.Model):
    name = pw.CharField()
    address = pw.CharField()

    class Meta:
        database = database

    def __str__(self):
        return self.name


database.connect()
database.create_tables([Relayer])
