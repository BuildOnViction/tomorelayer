import logging
from settings import settings


logger = logging.getLogger()
handler = logging.FileHandler('error.log')
formatter = logging.Formatter('%(asctime)s %(name)-12s %(levelname)-8s %(message)s')
handler.setFormatter(formatter)

if settings['stg'] == 'production':
    logger.addHandler(handler)
    logger.setLevel(logging.ERROR)
