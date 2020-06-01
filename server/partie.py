import time
from random import random , randint
from joueur import Joueur
from map import Map
from fleche import Fleche
from unitTest import TestUnit
from gameplay import Gameplay
from rect2 import Rect2

debug = False
if debug:
    import pygame
class Partie(Gameplay):

    def __init__(self,nom,id,sio,fps,joueur=None):
        self.ready = False;
        self.sio = sio
        self.nom = nom
        self.socketroom="s_"+nom
        self.id = id
        self.etat = 2
        self.joueurs= []
        self.objets=[]
        self.map = Map("../client/static/assets/maps/map_finale.json")
        co = self.map.collisionObjects + self.map.mapObjects

        self.duree=900#durée de la partie en secondes
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
        self.frame_fleche=randint(16*60*self.goal_fps,17*60*self.goal_fps)
        
        
        self.food_a=100*5#à mettre en place
        
        self.wood=0
        self.simpleHit=-1 # vaut -1 si personne ne frappe, sinon vaut la position du joueur qui frappe dans le tableau joueurs
        self.simpleHit_A=-1#à mettre en place
        
        
        

        self.end=False
        self.cas=0#cas de fin: 1=défaite, 2=victoire

        #variables de GAMEPLAY
        self.damage=-100#dommage pour les coups
        self.tree_damage=-100#dommage pour les arbres
        self.distance_coups=2500
        self.food_init=500
        self.food=100*5
        self.quantite_nourriture=5#quantité de nourriture consommé à chaque pression de F
        self.ratio=1#ratio de vie ajoutée en fction de la nourriture mangée
        self.addwood_min=10#quantité min de bois ajouté lors de la coupe d'un arbre
        self.addwood_max=20#quantité max de bois ajouté lors de la coupe d'un arbre
        self.addfood_min=20#pareil avec la nouriture
        self.addfood_max=40

        self.Tst = 0
        self.unit=TestUnit()
        self.count=0
        if joueur != None:
            self.rejoindrePartie(joueur)
            pass
                   
        #ETAT 0 : INITIALISATION; 1 : LOBBY; 2 : EN JEU; 3 : EN PAUSE; 4 : TERMINE
    
    def rejoindrePartie(self,joueur):
        if len(self.joueurs)<4:
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
                #await self.load_reconnect()
            
        await self.load_sync()

    async def start(self,j):
        #if len(self.joueurs)>1: #pour le test joueur unique
            if j == self.joueurs[0]: #seul le joueur ayant créé la partie peut la démarrer
                self.etat = 3
                for j in self.joueurs:
                    j.etape = 3
            
                await self.broadcast("game_start",None)
                self.init();
                await self.load_sync(); #le client devra attendre d'avoir recus ces infos pour init le jeu

    def init(self):
        ''' 
        Initialisation de la partie (position des joueurs, choix de la map etc.)
        '''
        self.unit.setUp(self)
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

        info = []
        for i in range (len(self.map.changedObjects)):
            info.append(dict())
            info[i]["id"] = self.map.changedObjects[i].id
            info[i]["name"] = self.map.changedObjects[i].name
        await self.broadcast("update_mapobjects",info)
        

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


        if self.waittime>0:
            #time.sleep(0.008)
            #await self.sio.sleep(0.015)
            pass
    
    '''
    def setPosition(self,joueur,data):
        if joueur in self.joueurs:#Nécessaire ????
            joueur.position = data

    def setVelocity(self,joueur,data):
        if joueur in self.joueurs:#Nécessaire ????
            joueur.velocity = data
    '''
    
    def move(self,joueur,data):
        #type de donnée: int
        #axe x : positif vers la droite
        #axe y : positif vers le bas
        if data<4:
            if data == 0:
                joueur.body.vyrB = -1
            elif data == 1:
                joueur.body.vxrB = 1
            elif data == 2:
                joueur.body.vyrB = 1
            elif data == 3:
                joueur.body.vxrB = -1
            
            
        
        else:
            if data == 4:
                joueur.body.vyrB = 0
            elif data == 5:
                joueur.body.vxrB = 0
            elif data == 6:
                joueur.body.vyrB = 0
            elif data == 7 :
                joueur.body.vxrB = 0

        

    def hit(self,joueur,data):
        if joueur.hasAmmo & data:
            if len(self.objets) < 10:
                fleche=Fleche(len(self.objets),joueur.body.x,joueur.body.y,40,139,300,0)
                fleche.vxr=1
                self.objets.append(fleche)
        elif data:
            for i in range(len(self.joueurs)):
                if self.joueurs[i] == joueur:
                    self.simpleHit_A=self.simpleHit
                    self.simpleHit=i
                    #l'info qu'on renvoie au client pour l'animation  
                else:
                    #print(self.dist2(joueur.body,self.joueurs[i].body))
                    if self.dist2(joueur.body,self.joueurs[i].body)<self.distance_coups:#arbitraire
                        self.joueurs[i].energie=self.joueurs[i].delta_vie(self.damage)
            #ajouter pour les arbres (ajout de nourriture/de bois)
            b = joueur.body
            f = 10
            bigHitbox = Rect2(b.x-f,b.y-f, b.h+2*f,b.w+2*f)
            toremove = -1
            for i in range(len(self.map.mapObjects)):
                #if self.dist2(joueur.body,self.map.mapObjects[i])< 2500:
                if self.map.mapObjects[i].name in ["arbre1","arbre2"]:
                    if self.collisionAABB(bigHitbox,self.map.mapObjects[i]):
                        if self.map.mapObjects[i].name=="arbre1":
                            self.addFood()
                        if self.map.mapObjects[i].name=="arbre2":
                            self.addWood()
                        toremove = i
            if toremove != -1:
                #self.map.mapObjects.pop(toremove)
                joueur.delta_vie(self.tree_damage)
                if self.map.mapObjects[toremove].name in ["arbre1","arbre2"]:
                    self.map.changeObjectTo(self.map.mapObjects[toremove],self.map.mapObjects[toremove].name + "_souche")
        else:
            self.simpleHit=-1


    def assignation_fleche(self):
        if self.framecount==self.frame_fleche:
            self.joueurs[randint(0,len(self.joueurs)-1)].hasAmmo=True

            



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
        #self.eatin(data)

        if self.etat == 3:
            #logique de jeu
            self.end_partie()
            await self.update() # mise à jour de la logique du jeu  
            await self.sendData()

        if self.end:
            self.etat=5
        await self.getFps()
        pass

    async def getInputs(self):
        for j in self.joueurs:
            """
            Fonction remplaçant les valeurs des objets par le buffer qui leur correspond.
            les evenements recus du client sont ajoutés au buffer des objets concernés à tout instant (via on_move par ex.)
            1 fois par frame, les buffers sont appliqués aux vraies variables des objets
            """
            j.body.getInputs()
        pass
    
    async def sendData(self):
    
        info = dict()
        njoueurs= len(self.joueurs)
        #On n'envoie que s'il y a changement depuis la derniere frame
        envoi = False
        for i in range(len(self.joueurs)):
            if self.joueurs[i].body.changeLast():
                envoi = True
        if(envoi):#A faire: un programme type changeLast mais général
            
            info["posx"] = [self.joueurs[i].body.x for i in range(njoueurs)]
            info["posy"] = [self.joueurs[i].body.y for i in range(njoueurs)]
            info["velx"] = [self.joueurs[i].body.vx for i in range(njoueurs)]
            info["vely"] = [self.joueurs[i].body.vy for i in range(njoueurs)]
            #url de la map ?
            await self.broadcast("update_pos",info)
            info=[]

        info=dict()
        info["nrj"] = [self.joueurs[i].energie for i in range(njoueurs)]       
        info["food"] = [self.food]
        info["simpleHit"] = self.simpleHit
        info["bois"] = self.wood
        info["fin"] = self.cas
        await self.broadcast("update_gameData",info)
        
        info = []
        for i in range (len(self.map.changedObjects)):
            info.append(dict())
            info[i]["id"] = self.map.changedObjects[i].id
            info[i]["name"] = self.map.changedObjects[i].name
        if self.map.changedObjects != []:
            """
            mauvais endroit ^^^ a mettre dans hit
              for j in range(len(self.map.changedObjects)):
                if self.map.changedObjects[i].name=="arbre1_souche":
                    self.addFood()
                elif self.map.changedObjects[i].name=="arbre2_souche":
                    self.addWood()
            #baisser la vie du joueur concerné
            """
            await self.broadcast("update_mapobjects",info)
            self.map.changedObjects = []


        info = []
        for i in range(len(self.objets)):
            info.append(dict())
            info[i]["x"]=self.objets[i].x
            info[i]["y"]=self.objets[i].y
            info[i]["direction"]=self.objets[i].direction
            info[i]["id"]=self.objets[i].id
        await self.broadcast("update_gameItems",info)

        #print(time.time()-t)

        


    async def update(self):
        #p = self.joueurs[1].position;
        #self.joueurs[1].position = [p[0],p[1]+1]

        t = time.time()
        self.move_objects()
        #self.updateBodies()
        #print(time.time()-t)

        self.assignation_fleche()

        if debug:
            self.debug_draw()
        


    def debug_draw(self):
        if(self.Tst!= 0):

                for event in pygame.event.get():
                    #if event.type == pygame.QUIT:
                    pass
                x=self.joueurs[0].body.x
                y=self.joueurs[0].body.y
                w=self.joueurs[0].body.w 
                h=self.joueurs[0].body.h 
                pygame.draw.rect(self.screen, self.BLACK, [x-300, y-300, w, h], 2)

                b = self.joueurs[0].body
                f = 10
                bigHitbox = Rect2(b.x-f,b.y-f, b.h+2*f,b.w+2*f)
                pygame.draw.rect(self.screen, self.GREEN, [bigHitbox.x-300, bigHitbox.y-300, bigHitbox.w, bigHitbox.h], 2)


                for i in range(len(self.objets)):
                    x = self.objets[i].x -300
                    y = self.objets[i].y-300
                    w = self.objets[i].w
                    h = self.objets[i].h
                    pygame.draw.rect(self.screen, self.GREEN, [x, y, w, h], 2)
                #self.co = self.map.collisionObjects
                for i in range(len(self.co)):
                    x = self.co[i].x-300 
                    y = self.co[i].y-300 
                    w = self.co[i].w
                    h = self.co[i].h
                    pygame.draw.rect(self.screen, self.RED, [x, y, w, h], 2)
                
                pygame.display.flip()
                self.screen.fill(self.WHITE)     

    def move_objects(self):
        
        #deplacement des joueurs avant tout
        self.co = self.map.collisionObjects + self.map.mapObjects #liste des hitboxes
        for joueur in self.joueurs:
            if not joueur.body.vx == joueur.body.vy == joueur.body.vxr == joueur.body.vyr == 0:
                fc = self.future_collisions(joueur.body) #on recupere les collisions du joueur avec son environnement
                self.resolve_collisions(joueur.body,fc) #on ajuste sa position pour la frame suivante
                #if self.count<=10:
                    #self.count+=1
                #else:
                #self.unit.test_deplacements(joueur,fc)

        for objet in self.objets :
            fc= self.future_collisions(objet)
            self.resolve_collisions(objet,fc,self.on_collision_fleche)
    
    def on_collision_fleche(self,obj,indexX=None,indexY=None,joueur=None):
        #Envoyer un evenement au client pour l'informer de la 
        #destruction de la fleche
        i = self.objets.index(obj)
        self.objets.pop(i)
        if joueur != None:
            pass
            #baisse de points de vie

    def updateBodies(self):
        for j in self.joueurs:
            j.body.newFrame()
    
    def collisionAABB(self,objet1,objet2):
        if (objet2.x >= objet1.x + objet1.w or 
            objet2.x + objet2.w <= objet1.x or
            objet2.y >= objet1.y + objet1.h or
            objet2.y + objet2.h <= objet1.y) :
            return False
        return True
                
    def dist2(self,objet1,objet2):
        return (objet1.x-objet2.x)**2 + (objet1.y-objet2.y)**2
    
    def future_position(self,objet):
        velocity = 200 #pixel / seconde 
        velocityFrame = velocity/self.goal_fps #en pixel par frame

        fpx = objet.x + objet.vxr*velocityFrame
        fpy = objet.y + objet.vyr*velocityFrame
        return fpx,fpy

    
    def future_collisions(self,objet):
        fpx,fpy = self.future_position(objet)
        deplacementY = Rect2(objet.x,fpy,objet.h,objet.w) #position frame suivante projetee sur Y
        deplacementX = Rect2(fpx,objet.y,objet.h,objet.w) # idem sur X

        #co = self.map.collisionObjects + self.map.mapObjects #liste des collisions fixes de la map 
        #co+=self.map.mapObjects

        collisionY = None
        collisionX = None   

        i = 0
        calc = 0
        L1 = []
        L2 = []
        while i < len(self.co) and (collisionY == None or collisionX == None) and 0 == 1:
            if self.dist2(self.co[i],objet) <= (objet.x-fpx)**2 + (objet.y-fpy)**2 + (self.co[i].w **2 + self.co[i].h**2) + objet.h**2 + objet.w**2: # check collision ssi la distance est assez faible
                
                if self.collisionAABB(deplacementY,self.co[i]):
                    collisionY = i
                if self.collisionAABB(deplacementX,self.co[i]):
                    collisionX = i
                calc+=1
            else:
                pass
            i+=1

        # on recupere les grilles concernées
        indexGridY = int(deplacementY.y//(self.map.width//self.map.gridSize*self.map.tileh))
        indexGridX = int(deplacementY.x//(self.map.height//self.map.gridSize*self.map.tilew))
        

        gridStartX = max(0,indexGridX-1)
        gridEndX = min(self.map.gridSize,indexGridX+1)
        gridStartY = max(0,indexGridY-1)
        gridEndY = min(self.map.gridSize,indexGridY+1)

        for y in range(gridStartY,gridEndY + 1):
            for x in range(gridStartX,gridEndX + 1):
                for i in range(len(self.map.grid[y][x])):
                    hitbox = self.map.grid[y][x][i]
                    if self.collisionAABB(deplacementY,hitbox):
                        collisionY = (y,x,i)
                    if self.collisionAABB(deplacementX,hitbox):
                        collisionX = (y,x,i)


        return (collisionX, collisionY)
        
    def resolve_collisions(self,objet,fc,callback = None):
        velocity = 200 #pixel / seconde 
        velocityFrame = velocity/self.goal_fps #en pixel par frame

        #co = self.map.collisionObjects

        if fc[0] != None:
            fcx = fc[0][2] #indice de l'objet collided ou False
        else :
            fcx = None
        if fc[1] != None:
            fcy = fc[1][2]
        else :
            fcy = None
        
        vpx = objet.vxr*velocity #velocité prévue selon x
        vpy = objet.vyr*velocity

        fpx = objet.x + objet.vxr*velocityFrame #position prevue selon x
        fpy = objet.y + objet.vyr*velocityFrame

        if fcx== None:
            objet.vx = vpx
            objet.x = fpx
        else:
            if objet.vxr == 1:
                objet.x = self.map.grid[fc[0][0]][fc[0][1]][fcx].x - objet.w
                #objet.x = self.co[fcx].x - objet.w
            elif objet.vxr == -1:
                objet.x = self.map.grid[fc[0][0]][fc[0][1]][fcx].x + self.map.grid[fc[0][0]][fc[0][1]][fcx].w
                #objet.x = self.co[fcx].x + self.co[fcx].w
            objet.vx = 0
        
        if fcy== None:
            objet.vy = vpy
            objet.y = fpy
        else:
            if objet.vyr == -1: # /!\ vers le haut
                objet.y = self.map.grid[fc[1][0]][fc[1][1]][fcy].y + self.map.grid[fc[1][0]][fc[1][1]][fcy].h
                #objet.y = self.co[fcy].y + self.co[fcy].h
            elif objet.vyr == +1:
                self.map.grid[fc[1][0]][fc[1][1]][fcy].y - objet.h
                #objet.y = self.co[fcy].y - objet.h
            objet.vy = 0

        joueurCollision = None
        if objet in self.objets:
            for i in range(len(self.joueurs)):
                if self.joueur[i].hasAmmo==False and self.collisionAABB(objet,self.joueurs[i].body):
                    joueurCollision = self.joueurs[i]

        if (fcx != None or fcy != None or joueurCollision != None) and callable(callback):
            callback(objet,fcx,fcy,joueurCollision);
    
    def end_partie(self):
        if not self.end:
            #cas 1: tout le monde est mort avant la fin du temps
            i=0
            bl=True
            while i<len(self.joueurs) and bl:
                if self.joueurs[i].alive:
                    bl=False
                i+=1
            if i==len(self.joueurs)-1 and bl:
                self.end=True
                self.cas=1

        if not self.end:    
            #cas 2: victoire!
            alives=0
            for j in range(len(self.joueurs)):
                if self.joueurs[j].alive:
                    alives+=1
            if alives!=0:
                if self.wood>=100*alives and self.food>75*alives:
                    self.end=True
                    self.cas=2
                

        if not self.end:
            #cas 3: temps écoulé!
            temps=time.time()
            if temps-self.timestamp_ini>self.duree:
                self.end=True
                self.cas=1


            
        




        