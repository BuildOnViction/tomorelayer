from os import getenv
from os import path
from pathlib import Path
from dotenv import load_dotenv
from peewee_async import Manager
from peewee_async import PooledMySQLDatabase

# IMPORT ENVIRONMENT VARIABLES
env_path = Path('..') / '.env'
load_dotenv(dotenv_path=env_path)

# SETUP ASYNC ORM
envars = ['user', 'password', 'host', 'port']
db_name = getenv('DB_NAME')
db_config = {k: getenv('DB_' + k.upper()) for k in envars}
db_config['port'] = int(db_config['port'])

database = PooledMySQLDatabase(db_name, **db_config)
objects = Manager(database)

# APPLICATION BACKEND SETTINGS
settings = {
    'autoreload': True,
    'db': {'name': db_name, **db_config},
    'debug': getenv('STG') != 'production',
    'login_url': '/login',
    'objects': objects,
    'port': getenv('APP_PORT'),
    'template_path': path.dirname(path.abspath(__file__)) + '/template',
    'xsrf_cookies': True,
    'stg': getenv('STG'),
}
