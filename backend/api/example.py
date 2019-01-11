from tornado.web import HTTPError
from model import TestNameModel
from .base import BaseHandler


class TestHandler(BaseHandler):
    def get(self):
        msg = 'YOLO'
        code = 401
        raise HTTPError(status_code=code, reason=msg)


class AsyncHandler(BaseHandler):
    async def post(self):
        name = self.get_argument('name')
        obj = await self.application.objects.create(TestNameModel, name=name)
        self.write({
            'id': obj.id,
            'name': obj.name
        })

    async def get(self):
        obj_id = self.get_argument('id', None)

        if not obj_id:
            self.write("Please provide the 'id' query argument, i.e. ?id=1")
            return

        try:
            obj = await self.application.objects.get(TestNameModel, id=obj_id)
            self.write({
                'id': obj.id,
                'name': obj.name,
            })
        except TestNameModel.DoesNotExist:
            raise HTTPError(404, "Object not found!")
