
from rect2 import Rect2
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
        '''
        self.x = 0;
        self.y = 0;
        self.w = 60;
        self.h = 60;
        '''
        self.body = Rect2(0,0,60,60,0,0)
        self.req_vel_buffer = [0,0] # le joueur n'a d'impact que sur la frame suivante
        self.req_vel = [0,0]
        self.velocity = [0,0]
        self.energie= 100
        self.energie_init=100
        self.alive=True

        
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
    def delta_vie(self,amount):
        self.energie+=amount
        if self.energie<0:
            self.energie=0
            self.alive=False
        if self.energie>100:
            self.energie=100
        return(self.energie)
    
    

