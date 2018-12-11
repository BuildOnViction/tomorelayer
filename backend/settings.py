import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('..') / '.env'
load_dotenv(dotenv_path=env_path)

settings = {
    "template_path": os.path.dirname(os.path.abspath(__file__)) + '/template',
    "login_url": "/login",
    "xsrf_cookies": True,
    "autoreload": os.getenv('STG') != 'production',
    "port": os.getenv('port'),
    "stg": os.getenv('stg'),
}
