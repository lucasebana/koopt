import uuid
class Client:
    ''' Classe permettant de stocker les informations d'un client '''
    def __init__(self,id_,socketid_,cookie_):
        self.id = id_;
        self.socketid = socketid_;
        self.cookie = cookie_;