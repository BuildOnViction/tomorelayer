class SocketClient:
    """Keep track of all socket connections to the server
    """
    clients = set()
    client_dict = {}

    @classmethod
    def add(cls, conn):
        if conn not in cls.clients:
            cls.clients.add(conn)
            cls.client_dict[conn.id] = conn

    @classmethod
    def retrieve(cls, id):
        return cls.client_dict[id]

    @classmethod
    def remove(cls, conn):
        clients.remove(conn)
        del client_dict[conn.id]
