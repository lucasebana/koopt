class Partie:
    nom=""
    id=""
    joueurs = []
    map = None

    def __init__(self,nom,id,sio,joueur=None):
        self.sio = sio
        self.nom = nom
        self.socketroom="s_"+nom
        self.id = id
        self.etat = 0
        if joueur != None:
            self.rejoindrePartie(joueur)
        #ETAT 0 : INITIALISATION; 1 : LOBBY; 2 : EN JEU; 3 : EN PAUSE; 4 : TERMINE
    
    def rejoindrePartie(self,joueur):
        self.joueurs.append(joueur)
        self.sio.enter_room(joueur.client.socketid,self.socketroom)
    
    
    def broadcast(self,header,data):
        self.sio.emit(header,data,room=self.socketroom)

    def send(self,header,data,joueur): #ou joueur id ? surcharge de la methode ?
        self.sio.emit(header,data,room=joueur.client.socketid)
        pass

    def context(self):
        pass