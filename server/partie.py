import time
from map import Map
from rect2 import Rect2
class Partie:

    def __init__(self,nom,id,sio,fps,joueur=None):
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
        self.goal_fps = fps;
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
        #self.joueurs[0].position = [50,50]
        self.joueurs[0].x = 243 # 236

    async def lobby(self):
        if self.etat == 2:
            jo = [self.joueurs[i].username if i < len(self.joueurs) else None for i in range(4)]
            await self.broadcast('lobby',{**{"nomSalle":self.nom,"idSalle":self.id},**{"j"+str(i):jo[i] for i in range(len(jo))}})

    async def broadcast(self,header,data):
        await self.sio.emit(header,data,room=self.socketroom)

    async def send(self,header,data,joueur):
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
        info["posx"] = [self.joueurs[i].x for i in range(njoueurs)]
        info["posy"] = [self.joueurs[i].y for i in range(njoueurs)]
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
            print("FPS: ", self.fps_current)
            self.fpscounter = 0
            self.fps_time = time.time()
            fps_delta = self.goal_fps - self.fps_current;
            
            #print("waittime : ",self.waittime)
                #print("waittime : ")

        """if (self.fps_last+self.fps_current) != 0 :
            self.waittime = (1/(self.goal_fps) - (self.realcurrent))*0.7;
        """

        if self.waittime>0:
            #time.sleep(0.008)
            #await self.sio.sleep(0.015)
            pass


    def setPosition(self,joueur,data):
        if joueur in self.joueurs:#Nécessaire ????
            joueur.position = data
    def setVelocity(self,joueur,data):
        if joueur in self.joueurs:#Nécessaire ????
            joueur.velocity = data
    
    def move(self,joueur,data):
        #type de donnée: int
        #axe x : positif vers la droite
        #axe y : positif vers le bas

        if data == 0:
            pass
        elif data == 1:
            pass
        elif data == 2:
            joueur.req_vel_buffer[1] = 1
        elif data == 3:
            pass

    async def load_sync(self):
        '''methode envoyant aux clients tt les données du jeu à l'initialisation du client'''
        for i in range(len(self.joueurs)):
            await self.load_sync_i(i)
        await self.load_sync_broad()

    async def context(self):
        self.start_frametime = time.time()
        await self.checkReconnexions();
        await self.lobby();

        #recuperation des inputs
        await self.getInputs()

        
        #logique de jeu
        await self.update() # mise à jour de la logique du jeu

        await self.sendData();

        await self.getFps();
        pass

    async def getInputs(self):
        for j in self.joueurs:
            j.req_vel = j.req_vel_buffer
        pass
    
    async def sendData(self):
        info = dict()
        njoueurs= len(self.joueurs)
        info["posx"] = [self.joueurs[i].x for i in range(njoueurs)]
        info["posy"] = [self.joueurs[i].y for i in range(njoueurs)]
        info["velx"] = [self.joueurs[i].velocity[0] for i in range(njoueurs)]
        info["vely"] = [self.joueurs[i].velocity[1] for i in range(njoueurs)]
        #url de la map ?
        await self.broadcast("update_pos",info)
        pass

    async def update(self):
        #p = self.joueurs[1].position;
        #self.joueurs[1].position = [p[0],p[1]+1]

        await self.move_objects()
        pass
            
    async def move_objects(self):
        #deplacement des joueurs avant tout
        for joueur in self.joueurs:
            fc =await self.future_collisions(joueur) #on recupere les collisions du joueur avec son environnement
            await self.resolve_collisions(joueur,fc) #on ajuste sa position pour la frame suivante

    async def collisionAABB(self,objet1,objet2):
        if any(
            [objet2.x >= objet1.x + objet1.w,
            objet2.x + objet2.w <= objet1.x,
            objet2.y >= objet1.y + objet1.h,
            objet2.y + objet2.h <= objet1.y]
            ):
            return False
        return True
    
    async def future_position(self,objet):
        velocity = 200 #pixel / seconde 
        velocity = velocity/self.goal_fps #en pixel par frame

        fpx = objet.x + objet.req_vel[0]*velocity
        fpy = objet.y + objet.req_vel[1]*velocity
        return fpx,fpy

    async def future_collisions(self,objet):
        fpx,fpy =await self.future_position(objet)
        deplacementY = Rect2(objet.x,fpy,objet.h,objet.w) #position frame suivante projetee sur Y
        deplacementX = Rect2(fpx,objet.y,objet.h,objet.w) # idem sur X

        co = self.map.collisionObjects #liste des collisions fixes de la map 

        collisionY = False
        collisionX = False

        i = 0
        while i < len(co) and (collisionY == False or collisionX == False):
            if await self.collisionAABB(deplacementY,co[i]):
                collisionY = i
            if await self.collisionAABB(deplacementX,co[i]):
                collisionX = i

            i+=1
        
        return [collisionX, collisionY]
        
    async def resolve_collisions(self,objet,fc):
        velocity = 200 #pixel / seconde 
        velocity = velocity/self.goal_fps #en pixel par frame


        co = self.map.collisionObjects

        fcx = fc[0] #indice de l'objet collided ou False
        fcy = fc[1]
        
        vpx = objet.req_vel[0]*velocity #velocité prévue selon x
        vpy = objet.req_vel[1]*velocity

        fpx = objet.x + objet.req_vel[0]*velocity #position prevue selon x
        fpy = objet.y + objet.req_vel[1]*velocity

        if fcx== False:
            objet.velocity[0] = vpx
            objet.x = fpx
        else:
            if objet.req_vel[0] == 1:
                objet.x = co[fcx].x - objet.w
            elif objet.req_vel[0] == -1:
                objet.x = co[fcx].x + co[fcx].w
            objet.velocity[0] = 0
        
        if fcy== False:
            objet.velocity[1] = vpy
            objet.y = fpy
        else:
            if objet.req_vel[0] == 1: # /!\ vers le bas
                objet.y = co[fcx].y - objet.h
            elif objet.req_vel[0] == -1:
                objet.y = co[fcx].y + co[fcx].h
            objet.velocity[0] = 0
        

        

        