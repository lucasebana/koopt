import time
from map import Map

class Partie:

    def __init__(self,nom,id,sio,joueur=None):
        self.ready = False;
        self.sio = sio
        self.nom = nom
        self.socketroom="s_"+nom
        self.id = id
        self.etat = 2
        self.joueurs= []
        self.map = Map("../client/static/assets/map4.json")

        self.start_frametime = 0;
        self.finish_frametime = 0;
        self.goal_fps = 60;
        self.waittime = 0;
        self.framecount = 0
        self.fps_time = time.time();
        self.fpscounter = 0
        self.fps_current = 0
        self.fps_last = 0
        self.realcurrent = 0
        self.realprevious = 0
        self.timestamp_ini=time.time();

        if joueur != None:
            self.rejoindrePartie(joueur)
            pass
            
        #TODO :
        #https://github.com/bitcraft/PyTMX#loading-from-xml
        #Split partie.py en plusieur fichiers
        #Deplacer code client de assets.
        
        #ETAT 0 : INITIALISATION; 1 : LOBBY; 2 : EN JEU; 3 : EN PAUSE; 4 : TERMINE
    
    def rejoindrePartie(self,joueur):
        self.joueurs.append(joueur)
        self.sio.enter_room(joueur.socketid,self.socketroom)
        joueur.partie = self;
    
    async def checkReconnexions(self):
        ''' Fonction qui renseigne les nouveaux sid 
        dans la room en cas de déconnexion '''
        for j in self.joueurs:
            newSid = j.check_sid()
            if newSid != False:
                self.sio.enter_room(newSid,self.socketroom)
                self.sio.leave_room(j.oldSid,self.socketroom)#on libere l'ancien sid (nécessaire ?)
            
        await self.load_sync()

    async def start(self,j):
        if j == self.joueurs[0]: #seul le joueur ayant créé la partie peut la démarrer
            self.etat = 3
            for j in self.joueurs:
                j.etape = 3
            
            await self.broadcast("game_start",None)
            self.init();
            await self.load_sync(); #le client devra attendre d'avoir recus ces infos pour init le jeu

    def init(self):
        ''' Initialisation de la partie (position des joueurs, choix de la map etc.)            
        
        '''
        self.joueurs[0].position = [50,50]

    async def lobby(self):
        if self.etat == 2:
            jo = [self.joueurs[i].username if i < len(self.joueurs) else None for i in range(4)]
            await self.broadcast('lobby',{**{"nomSalle":self.nom,"idSalle":self.id},**{"j"+str(i):jo[i] for i in range(len(jo))}})

    async def broadcast(self,header,data):
        await self.sio.emit(header,data,room=self.socketroom)

    async def send(self,header,data,joueur): #ou joueur id ? surcharge de la methode ?
        await self.sio.emit(header,data,room=joueur.socketid)
        pass

    def pause(self):
        self.etat = 4

    async def load_sync_i(self,i):
        ''' methode renvoyant les données du joueur i à l'init* client'''
        info_perso = dict()
        info_perso["numero"] = i;
        info_perso["timestampinit"] = self.timestamp_ini;
        await self.send("load_i",info_perso,self.joueurs[i])

    async def load_sync_broad(self):
        ''' methode renvoyant les données communes à ts les joueurs à l'init* client'''
        info = dict()
        njoueurs= len(self.joueurs)
        info["noms"] = [self.joueurs[i].username for i in range(njoueurs)]
        info["posx"] = [self.joueurs[i].position[0] for i in range(njoueurs)]
        info["posy"] = [self.joueurs[i].position[1] for i in range(njoueurs)]
        info["velx"] = [self.joueurs[i].velocity[0] for i in range(njoueurs)]
        info["vely"] = [self.joueurs[i].velocity[1] for i in range(njoueurs)]
        #url de la map ?
        await self.broadcast("load_game",info)
        #await self.broadcast("load_game",{"data1":["jean","jacques","pierre"]})
        #await self.broadcast("load_game",info)

    async def getFps(self):
        self.framecount+=1
        self.fpscounter+=1
        ti = time.time()
        if (ti - self.fps_time) > 1 :
            self.fps_last = self.fps_current
            self.fps_current = self.fpscounter / (ti - self.fps_time)
            #print("FPS: ", self.fps_current)
            self.fpscounter = 0
            self.fps_time = time.time()
            fps_delta = self.goal_fps - self.fps_current;
            
            #print("waittime : ",self.waittime)
                #print("waittime : ")

        """if (self.fps_last+self.fps_current) != 0 :
            self.waittime = (1/(self.goal_fps) - (self.realcurrent))*0.7;
        """

        if self.waittime>0:
            time.sleep(0.008)
            #await self.sio.sleep(0.015)


    def setPosition(self,joueur,data):
        if joueur in self.joueurs:#Nécessaire ????
            joueur.position = data
    def setVelocity(self,joueur,data):
        if joueur in self.joueurs:#Nécessaire ????
            joueur.velocity = data
        

    async def load_sync(self):
        '''methode envoyant aux clients tt les données du jeu à l'initialisation du client'''
        for i in range(len(self.joueurs)):
            await self.load_sync_i(i)
        await self.load_sync_broad()

    async def context(self):
        self.start_frametime = time.time()
        await self.checkReconnexions();
        await self.lobby();

        #envoi de données au client
        #await self.load_sync(); #données initialisation
        #await self.fast_sync(); #données utiles, frequence rapide

        #envoyer au client la position et les actions le plus regulierement
        #les evenements secondaires moins souvent
        #les infos statiques (nom des joueurs, etc.), a l'init
        
        await self.update() # mise à jour de la logique du jeu

        await self.getFps();
        pass

    async def update(self):
        #p = self.joueurs[1].position;
        #self.joueurs[1].position = [p[0],p[1]+1]
        pass
            
            

        