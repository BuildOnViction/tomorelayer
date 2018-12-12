import peewee
from settings import database


class TestNameModel(peewee.Model):
    name = peewee.CharField()

    class Meta:
        database = database

    def __str__(self):
        return self.name


TestNameModel.create_table(True)
TestNameModel.get_or_create(id=1, defaults={'name': "TestNameModel id=1"})
TestNameModel.get_or_create(id=2, defaults={'name': "TestNameModel id=2"})
TestNameModel.get_or_create(id=3, defaults={'name': "TestNameModel id=3"})
database.close()
