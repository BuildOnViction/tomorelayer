# from logzero import logger
from api.base import BaseHandler
from exception import InvalidValueException
from util.decorator import authenticated


class MailHandler(BaseHandler):

    @authenticated
    async def post(self, user):
        mail = self.request_body

        if not mail.get('feedback') or len(mail['feedback']) < 20 or len(mail['feedback']) > 400:
            raise InvalidValueException('Missing or invalid feedback message')

        import smtplib
        # message = mail.get('feedback')
        # gmail_user = 'example@tomochain.com'
        # gmail_password = 'example'

        # sent_from = gmail_user
        # to = ['admin@tomochain.com']
        # subject = 'OMG Super Important Message'
        # body = """
        # {message}
        # """.format(message=message)

        # try:
        #      server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        #      server.ehlo()
        #      server.login(gmail_user, gmail_password)
        #      server.sendmail(sent_from, to, email_text)
        #      server.close()
        #      self.write('ok')

        # except Exception as err:
        #     logger.debug(err)
