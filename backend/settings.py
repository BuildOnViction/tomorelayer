import json
import tornado.autoreload
from os import getenv
from os import path
from logzero import logger
from pathlib import Path
from dotenv import load_dotenv
from peewee_async import Manager
from peewee_async import PooledPostgresqlDatabase

# IMPORT ENVIRONMENT VARIABLES
env_path = Path('..') / '.env'
load_dotenv(dotenv_path=env_path)
is_production = getenv('STG') == 'production'

# SETUP ASYNC ORM
envars = ['user', 'password', 'host', 'port']
db_name = getenv('DB_NAME')
db_config = {k: getenv('DB_' + k.upper()) for k in envars}
db_config['port'] = int(db_config['port'])

database = PooledPostgresqlDatabase(db_name, **db_config)
objects = Manager(database)

# READ a friendly contracts.json
contracts = None
try:
    with open('contracts.json') as json_file:
        contracts = json.load(json_file)
        logger.info('Loaded all the contract data')

        if not is_production:
            logger.info('Watching contracts.json for changes')
            tornado.autoreload.watch('contracts.json')
            tornado.autoreload.add_reload_hook(lambda: logger.warn('Reloading...'))

except Exception as err:
    logger.error('Cannot read contracts.json')
    logger.error('Make sure you have already compiled all the necessary contracts with Embark')
    logger.error(err)
    exit(1)


# APPLICATION BACKEND SETTINGS
base_path = path.dirname(__file__)
settings = {
    'autoreload': not is_production,
    'db': {'name': db_name, **db_config},
    'debug': not is_production,
    'login_url': '/login',
    'objects': objects,
    'port': getenv('APP_PORT'),
    'static_path': base_path + '/static',
    'stg': getenv('STG'),
    'contracts': contracts
}
