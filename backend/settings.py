from os import getenv, path
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('..') / '.env'
load_dotenv(dotenv_path=env_path)

settings = {
    "template_path": path.dirname(path.abspath(__file__)) + '/template',
    "login_url": "/login",
    "xsrf_cookies": True,
    "autoreload": True,
    "port": getenv('APP_PORT'),
    "stg": getenv('STG'),
    "db": {
        "name": getenv('DB_NAME'),
        "user": getenv('DB_USER'),
        "password": getenv('DB_PASSWORD'),
        "host": getenv('DB_HOST'),
        "port": getenv('DB_PORT'),
    }
}
