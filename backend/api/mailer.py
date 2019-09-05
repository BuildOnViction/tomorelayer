from api.base import BaseHandler
from exception import InvalidValueException
from util.decorator import authenticated


class MailHandler(BaseHandler):

    @authenticated
    async def post(self, user):
        mail = self.request_body

        if not mail.get('feedback') or len(mail['feedback']) < 20 or len(mail['feedback']) > 400:
            raise InvalidValueException('Missing or invalid feedback message')

        self.write('ok')
