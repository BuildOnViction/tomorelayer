from os import getenv, getcwd
from os import path
from logzero import logger
from dotenv import load_dotenv
from peewee_async import Manager
from peewee_asyncext import PooledPostgresqlExtDatabase

# IMPORT ENVIRONMENT VARIABLES
env_path = getenv('ENV_PATH')
load_dotenv(dotenv_path=env_path, override=True)
is_production = getenv('STG') == 'production'
logger.warning('APPLICATION-STAGE: %s', '=Production=' if is_production else '=Development=')

REACT_APP_HOST = getenv('REACT_APP_HOST')
REACT_APP_PORT = getenv('REACT_APP_PORT')
tunnel_url = getenv('TUNNEL_URL')
base_url = '{}:{}'.format(REACT_APP_HOST, REACT_APP_PORT) if not is_production else REACT_APP_HOST
# Favor tunneled url over existing url
base_url = tunnel_url or base_url

# SETUP ASYNC ORM
envars = ['user', 'password', 'host', 'port']
db_name = getenv('DB_NAME')
db_config = {k: getenv('DB_' + k.upper()) for k in envars}
db_config['port'] = int(db_config['port'])

database = PooledPostgresqlExtDatabase(db_name, **db_config)
objects = Manager(database)

# APPLICATION BACKEND SETTINGS
base_path = path.dirname(__file__)
settings = {
    'autoreload': not is_production,
    'cookie_secret': getenv('SECRET_COOKIE'),
    'db': {'name': db_name, **db_config},
    'debug': not is_production,
    'login_url': '/login',
    'objects': objects,
    'port': REACT_APP_PORT,
    'static_path': base_path + '/static',
    'stg': getenv('STG'),
    'template_path': base_path + '/template',
}
