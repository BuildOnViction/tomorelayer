class CustomException(Exception):
    status_code = 500
    message = ''

    def __init__(self, detail=''):
        super().__init__()
        self.detail = detail


class MissingArgumentException(CustomException):
    status_code = 400
    message = 'Missing required attribute(s)'


class InvalidValueException(CustomException):
    status_code = 400
    message = 'Invalid value(s)'


class NotUniqueException(CustomException):
    status_code = 400
    message = 'Field value is not unique'


class AuthorizationException(CustomException):
    status_code = 401
    message = 'Only web admin can make this request'
