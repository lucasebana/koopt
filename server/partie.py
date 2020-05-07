import time
from map import Map

from rect2 import Rect2

debug = False
if debug:
    import pygame
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
        self.t0=time.time()

        self.Tst = 0

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
        
        self.BLACK = (0, 0, 0)
        self.WHITE = (255, 255, 255)
        self.BLUE = (0, 0, 255)
        self.GREEN = (0, 255, 0)
        self.RED = (255, 0, 0)

        if debug:
            pygame.init()
            self.screen = pygame.display.set_mode((500, 500))
            self.Tst = 1
            self.screenpygame.display.set_caption("debug")
        

        
        #self.joueurs[0].position = [50,50]
        #self.joueurs[0].x = 243 # 236

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
        info["posx"] = [self.joueurs[i].body.x for i in range(njoueurs)]
        info["posy"] = [self.joueurs[i].body.y for i in range(njoueurs)]
        info["velx"] = [self.joueurs[i].body.vx for i in range(njoueurs)]
        info["vely"] = [self.joueurs[i].body.vy for i in range(njoueurs)]
        info["nrj"] = [self.joueurs[i].energie for i in range(njoueurs)]
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

            if len(self.joueurs) != 0:
                #print(self.joueurs[0].body.x,self.joueurs[0].body.y)
                pass

            
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
            joueur.body.vyrB = -1
        elif data == 1:
            joueur.body.vxrB = 1
        elif data == 2:
            joueur.body.vyrB = 1
        elif data == 3:
            joueur.body.vxrB = -1


        elif data == 4:
            joueur.body.vyrB = 0
        elif data == 5:
            joueur.body.vxrB = 0
        elif data == 6:
            joueur.body.vyrB = 0
        elif data == 7 :
            joueur.body.vxrB = 0
    
    def calcul_vie(self):#on ajoutera ici tous les types de dommages ou de gain de vie
        t=time.time()
        diff=t-self.t0
        if diff>=1:
            for i in range(len(self.joueurs)):
                self.joueurs[i].energie=self.joueurs[i].delta_vie(-diff*0.1)
            self.t0=t   




    async def load_sync(self):
        '''methode envoyant aux clients tt les données du jeu à l'initialisation du client'''
        for i in range(len(self.joueurs)):
            await self.load_sync_i(i)
        await self.load_sync_broad()

    async def context(self):
        self.start_frametime = time.time()
        await self.checkReconnexions()
        await self.lobby()

        #recuperation des inputs
        await self.getInputs()

        self.calcul_vie()

        if self.etat == 3:
            #logique de jeu
            await self.update() # mise à jour de la logique du jeu  
            await self.sendData()
            self.updateBodies()

        await self.getFps()
        pass

    async def getInputs(self):
        for j in self.joueurs:
            #j.req_vel = j.req_vel_buffer
            j.body.getInputs()
        pass
    
    async def sendData(self):
        info = dict()
        njoueurs= len(self.joueurs)
        #On n'envoie que s'il y a changement depuis la derniere frame
        if(self.joueurs[0].body.changeLast()):#A faire: un programme type changeLast mais général
            
            info["posx"] = [self.joueurs[i].body.x for i in range(njoueurs)]
            info["posy"] = [self.joueurs[i].body.y for i in range(njoueurs)]
            info["velx"] = [self.joueurs[i].body.vx for i in range(njoueurs)]
            info["vely"] = [self.joueurs[i].body.vy for i in range(njoueurs)]
            #url de la map ?
            await self.broadcast("update_pos",info)
        
        info=dict()
        info["nrj"] = [self.joueurs[i].energie for i in range(njoueurs)]
        await self.broadcast("update_gameData",info)

    async def update(self):
        #p = self.joueurs[1].position;
        #self.joueurs[1].position = [p[0],p[1]+1]

        await self.move_objects()
        
        x=self.joueurs[0].body.x
        y=self.joueurs[0].body.y
        h = self.joueurs[0].body.h
        w = self.joueurs[0].body.w


        if debug:
            self.debug_draw()
        


    def debug_draw(self):
        if(self.Tst!= 0):

                for event in pygame.event.get():
                    #if event.type == pygame.QUIT:
                    pass
                
                pygame.draw.rect(self.screen, self.BLACK, [x, y, w, h], 2)
                co = self.map.collisionObjects
                for i in range(len(co)):
                    x = co[i].x
                    y = co[i].y
                    w = co[i].w
                    h = co[i].h
                    pygame.draw.rect(self.screen, self.RED, [x, y, w, h], 2)
                
                pygame.display.flip()
                self.screen.fill(self.WHITE)     

    async def move_objects(self):
        #deplacement des joueurs avant tout
        for joueur in self.joueurs:
            fc =await self.future_collisions(joueur.body) #on recupere les collisions du joueur avec son environnement
            await self.resolve_collisions(joueur.body,fc) #on ajuste sa position pour la frame suivante


    def updateBodies(self):
        for j in self.joueurs:
            j.body.newFrame()
    
    async def collisionAABB(self,objet1,objet2):
        if any(
            [objet2.x >= objet1.x + objet1.w,
            objet2.x + objet2.w <= objet1.x,
            objet2.y >= objet1.y + objet1.h,
            objet2.y + objet2.h <= objet1.y]
            ):
            return False
        if objet1.x==objet1.y==192:
            pass
        return True
        
        """
        ret = False
        if objet2.x >= objet1.x + objet1.w:
            ret = True
            print("GAUCHE")
        if objet2.x + objet2.w <= objet1.x:
            ret = True
            print("DROITE")  
        if objet2.y >= objet1.y + objet1.h:
            ret = True
            print("HAUT")
        if objet2.y + objet2.h <= objet1.y:
            ret = True
            print("BAS")
        return ret
        """
        
    
    async def future_position(self,objet):
        velocity = 200 #pixel / seconde 
        velocityFrame = velocity/self.goal_fps #en pixel par frame

        fpx = objet.x + objet.vxr*velocityFrame
        fpy = objet.y + objet.vyr*velocityFrame
        return fpx,fpy

    async def future_collisions(self,objet):
        fpx,fpy =await self.future_position(objet)
        deplacementY = Rect2(objet.x,fpy,objet.h,objet.w) #position frame suivante projetee sur Y
        deplacementX = Rect2(fpx,objet.y,objet.h,objet.w) # idem sur X

        co = self.map.collisionObjects #liste des collisions fixes de la map 
        
        collisionY = None
        collisionX = None

        i = 0
        while i < len(co) and (collisionY == None or collisionX == None):
            if await self.collisionAABB(deplacementY,co[i]):
                collisionY = i
            if await self.collisionAABB(deplacementX,co[i]):
                collisionX = i

            i+=1
        
        return [collisionX, collisionY]
        
    async def resolve_collisions(self,objet,fc):
        velocity = 200 #pixel / seconde 
        velocityFrame = velocity/self.goal_fps #en pixel par frame

        co = self.map.collisionObjects

        fcx = fc[0] #indice de l'objet collided ou False
        fcy = fc[1]
        
        vpx = objet.vxr*velocity #velocité prévue selon x
        vpy = objet.vyr*velocity

        fpx = objet.x + objet.vxr*velocityFrame #position prevue selon x
        fpy = objet.y + objet.vyr*velocityFrame

        if fcx== None:
            objet.vx = vpx
            objet.x = fpx
        else:
            if objet.vxr == 1:
                objet.x = co[fcx].x - objet.w
            elif objet.vxr == -1:
                objet.x = co[fcx].x + co[fcx].w
            objet.vx = 0
        
        if fcy== None:
            objet.vy = vpy
            objet.y = fpy
        else:
            if objet.vyr == -1: # /!\ vers le haut
                objet.y = co[fcy].y + co[fcy].h
            elif objet.vyr == +1:
                objet.y = co[fcy].y - objet.h
            objet.vy = 0
        