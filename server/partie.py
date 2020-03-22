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
        self.etat = 2
        self.joueurs= []

        self.framecount = 0
        if joueur != None:
            self.rejoindrePartie(joueur)
        #ETAT 0 : INITIALISATION; 1 : LOBBY; 2 : EN JEU; 3 : EN PAUSE; 4 : TERMINE
    
    def rejoindrePartie(self,joueur):
        self.joueurs.append(joueur)
        self.sio.enter_room(joueur.socketid,self.socketroom)
        joueur.partie = self;
    
    def checkReconnexions(self):
        ''' Fonction qui renseigne les nouveaux sid 
        dans la room en cas de déconnexion '''
        for j in self.joueurs:
            newSid = j.check_sid()
            if newSid != False:
                self.sio.enter_room(newSid,self.socketroom)
                self.sio.leave_room(j.oldSid,self.socketroom)#on libere l'ancien sid (nécessaire ?)
    async def start(self,j):
        if j == self.joueurs[0]: #seul le joueur ayant créé la partie peut la démarrer
            self.etat = 3
            for j in self.joueurs:
                j.etape = 3
            await self.broadcast("game_start",None)

    async def lobby(self):
        '''
        if len(self.joueurs) < 4:
            self.etat = 2
            jo = [self.joueurs[i].username if i < len(self.joueurs) else None for i in range(4)]
            await self.broadcast('lobby',{**{"nomSalle":self.nom,"idSalle":self.id},**{"j"+str(i):jo[i] for i in range(len(jo))}})
        if len(self.joueurs) == 4:
            self.etat = 3
        if(self.etat == 4):
            pass
        '''
        if self.etat == 2:
            jo = [self.joueurs[i].username if i < len(self.joueurs) else None for i in range(4)]
            await self.broadcast('lobby',{**{"nomSalle":self.nom,"idSalle":self.id},**{"j"+str(i):jo[i] for i in range(len(jo))}})


    async def broadcast(self,header,data):
        await self.sio.emit(header,data,room=self.socketroom)

    def send(self,header,data,joueur): #ou joueur id ? surcharge de la methode ?
        self.sio.emit(header,data,room=joueur.socketid)
        pass

    def pause(self):
        self.etat = 4
    async def context(self):
        self.framecount+=1
        self.checkReconnexions()
        await self.lobby()
        
            
            

        