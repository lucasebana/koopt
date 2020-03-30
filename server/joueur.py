class Joueur:
    ''' Classe spécifique au jeu '''
    '''
    energie;
    bois
    nourriture;
    coordonnées;
    vitesse;
    '''
    def __init__(self, id, username, socketid, cookie):
        self.id = id;
        self.socketid = socketid;
        self.newSid = False;
        self.username = username;
        self.cookie = cookie;
        self.etape = 0;
        self.partie = None
        self.position = [0,0]
        
        #liste des sids ?
    def reset_sid(self,newSid):
        self.socketid, self.oldSid = newSid, self.socketid
        self.newSid = True;

    def check_sid(self):
        if self.newSid:
            self.newSid = False
            return self.socketid;
        return False
        '''
        self.client = client;
        self.energie=100
        self.bois=0
        self.nourriture=0
        self.coordonnees=coordonnees
        self.vitesse=[0,0]
        '''

    def hello():
        print("hello")
