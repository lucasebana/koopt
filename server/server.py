#Importation de librairies
import asyncio
import uuid 

from sanic import Sanic
from sanic.response import html

import socketio


#Importation de fichiers du projet
from partie import Partie
import map
from client import Client
from joueur import Joueur
import ressource



class Server:
    ''' Classe principale de l'application '''

    Parties = []
    Clients = [] # = [{id="",joueurid, cookieID, sid, autres...}]
    Joueurs = []
    
    def __init__(self):
        self.running = True
        self.fps = 1 # Valeur de production plus proche de 60
        self.mavariable=0 # Variable test


        ''' Serveurs http et websocket '''
        self.sio = socketio.AsyncServer(async_mode='sanic')
        self.app = Sanic(name="koopt")
        self.sio.attach(self.app)


    def start(self): 
        ''' Démarrage des serveurs et routage '''
        @self.app.listener('before_server_start')
        def before_server_start(sanic, loop):
            self.sio.start_background_task(self.run)

        @self.app.route('/')
        async def index(request):
            with open('../client/index.html') as f:
                return html(f.read())

        self.sio.register_namespace(ServeurHandler('/',self.sio,self))
        self.app.static('/static', '../client/static')
        self.app.run()

    async def creerClient(self,sid,username):
        cookie = str(uuid.uuid4())[:8]
        while cookie in [self.Clients[i].cookie for i in range(len(self.Clients))]  :
            cookie = str(uuid.uuid4)[:8]
        #Checker un conflit socketid ?
        #Il faudrait vérifier si le nom est correct (different/non vide ...)
        c = Client(len(self.Clients),username,sid,cookie)
        self.Clients.append(c)
        await self.sio.emit('user_cookie', {'data': cookie}, room=sid)
        print("Nouveau client enregistré ! ")
        print(cookie)

        #Si tout est correct on envoie une validation au client
        await self.sio.emit('user_registration_cookie', {'data': cookie}, room=sid)
        c.etape=1
        #Sinon message d'erreur...     

        pass

    async def checkClient(self,sid,cookie):
        ''' fonction serveur vérifiant que l'utilisateur
        possède bien un identifiant(stocké ss forme de cookie) unique '''
        if cookie["data"] in [self.Clients[i].cookie for i in range(len(self.Clients))]:
            index = [self.Clients[i].cookie for i in range(len(self.Clients))].index(cookie["data"])
            self.Clients[index].socketid = sid
            await self.sio.emit('user_cookie_check', {'data': 'client_valide','etape':self.Clients[index].etape}, room=sid)
        else:
            await self.sio.emit('user_cookie_check', {'data': 'client_invalide'}, room=sid)
    
    def creerJoueur(self,sid,coords):
        idClient = self.trouverClient(sid)
        j = Joueur(self.Clients[idClient].username,self.Clients[idClient],coords)
        self.Joueurs.append(j)
        return j

    def trouverClient(self,sid):
        for i in range(len(self.Clients)):
            if self.Clients[i].socketid == sid:
                return i
        return -1 #erreur.. gérer l'exception ?

    async def creerPartie(self,sid,data):
        #if j != None:#Si on n'a pas donné j en param
        j = self.creerJoueur(sid,[0,0]) #on crée un joueur sinon on garde celui fourni
        idPartie = len(self.Parties)
        self.Parties.append(Partie("partie"+str(idPartie), len(self.Parties),self.sio,j))
        await self.sio.emit('acces_partie', "success", room=sid)
        j.client.etape=2
        pass

    async def rejoindrePartie(self,sid,data):
        j = self.creerJoueur(sid,[0,0])
        if(type(data) is int):
            #idealement on conserve un lien entre les ids et les index dans la liste
            #idealement index != id et id pas forcement un entier
            if data < len(Parties):
                Parties[data].rejoindrePartie(j)
                await self.sio.emit('acces_partie', "success", room=sid)
                j.client.etape=2
            else:
                pass #Erreur, id de partie inexistant


    async def run(self):
        ''' boucle principale de la logique du serveur de jeu 
        cette boucle s'éxécute en parallèle des serveurs web'''
        while self.running == True:
            for p in self.Parties:
                p.context()
            await self.sio.sleep(1/(self.fps)) # serveur a 60fps
            print("server running")
            #print("mavariable = ", self.mavariable)

    def setmavariable(self): #fonction test qui incrémente mavariable
        self.mavariable+=100


class ServeurHandler(socketio.AsyncNamespace):
    ''' Classe s'occupant des évènements socketio recus en '/' '''
    def __init__(self,addr,sio_,serveur_):
        super().__init__(addr)
        self.sio = sio_
        self.s = serveur_

    async def on_connect(self, sid, environ):
        ''' fonction executée a la reception de l'evenement 'connect' '''
        await self.sio.emit('my_response', {'data': 'Connected', 'count': 0}, room=sid)

    def on_disconnect(self,sid):
        print('Client disconnected')
    
    def on_mon_event(self,sid,data):
        ''' evenement test qui appelle s.setmavariable 
        qui incrémente un variable test du serveur'''
        print("salut " + sid + " !");
        self.s.setmavariable();
        print(data)

    async def on_envoi_cookie(self,sid,data):
        await self.s.checkClient(sid,data);
        

    async def on_mon_username(self,sid,data):
        await self.s.creerClient(sid,data);

    async def on_host_partie(self,sid,data):
        await self.s.creerPartie(sid,data);
    
    async def on_join_partie(self,sid,data):
        await self.s.rejoindrePartie(sid,data);
        