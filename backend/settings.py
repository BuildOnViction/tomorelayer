from os import getenv
from os import path
from pathlib import Path
from dotenv import load_dotenv
from peewee_async import Manager
from peewee_asyncext import PooledPostgresqlExtDatabase

# IMPORT ENVIRONMENT VARIABLES
load_dotenv()
is_production = getenv('STG') == 'production'
tunnel_url = getenv('TUNNEL_URL')
base_url = '{}:{}'.format(getenv('REACT_APP_HOST'), getenv('REACT_APP_PORT')) if not is_production else getenv('REACT_APP_HOST')
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
    'port': getenv('REACT_APP_PORT'),
    'static_path': base_path + '/static',
    'stg': getenv('STG'),
    'template_path': base_path + '/template',
}
