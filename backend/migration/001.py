"""
Any schema-alteration will go here
"""
from playhouse.migrate import *
from model import *
from settings import database

migrator = PostgresqlMigrator(database)
