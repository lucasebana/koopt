class Client:
    ''' Classe spécifique au site '''
    ''' Classe permettant de stocker les informations d'un client '''
    def __init__(self,id,username,socketid,cookie):
        self.id = id;
        self.socketid = socketid;
        self.username = username;
        self.etape = 0
        #liste des sids ?
        self.cookie = cookie;