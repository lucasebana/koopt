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
        self.joueurs= []
        if joueur != None:
            self.rejoindrePartie(joueur)
        #ETAT 0 : INITIALISATION; 1 : LOBBY; 2 : EN JEU; 3 : EN PAUSE; 4 : TERMINE
    
    def rejoindrePartie(self,joueur):
        self.joueurs.append(joueur)
        self.sio.enter_room(joueur.client.socketid,self.socketroom)
    
    def reconnexionPartie(self, joueur):
        pass
    
    async def broadcast(self,header,data):
        await self.sio.emit(header,data,room=self.socketroom)

    def send(self,header,data,joueur): #ou joueur id ? surcharge de la methode ?
        self.sio.emit(header,data,room=joueur.client.socketid)
        pass

    def pause(self):
        self.etat = 4
    async def context(self):
        if len(self.joueurs) < 4:
            self.etat = 2
            jo = [self.joueurs[i].nom if i < len(self.joueurs) else None for i in range(4)]
            await self.broadcast('lobby',{**{"nomSalle":self.nom,"idSalle":self.id},**{"j"+str(i):jo[i] for i in range(len(jo))}})
        if len(self.joueurs) == 4:
            self.etat = 3
        if(self.etat == 4):
            pass
            #self.broadcast('lobby',{'nomSalle':'nom','j1':'nomj1','j2':'nomj2','j3':None,'j4':None})
            

        