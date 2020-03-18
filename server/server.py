#Importation de librairies
import asyncio
import uuid 

from sanic import Sanic
from sanic.response import html

import socketio


#Importation de fichiers du projet
from client import Client
import joueur


class Server:
    
    Parties = []
    Clients = [] # = [{id="",joueurid, cookieID, autres...}]




    def __init__(self): #demarrage sur serveur socket.io
        self.running = True
        self.fps = 1
        self.mavariable=0


        ''' Serveurs http et websocket'''
        self.sio = socketio.AsyncServer(async_mode='sanic')
        self.app = Sanic(name="koopt")
        self.sio.attach(self.app)


    def start(self):

        @self.app.listener('before_server_start')
        def before_server_start(sanic, loop):
            self.sio.start_background_task(self.run,self.sio)

        @self.app.route('/')
        async def index(request):
            with open('../client/index.html') as f:
                return html(f.read())

        self.sio.register_namespace(ServeurHandler('/',self.sio,self))
        self.app.static('/static', '../client/static')
        self.app.run();

    def creerPartie(self):
        pass

    async def nouveauClient(self,sid,username,sio):
        cookie = str(uuid.uuid4())[:8]
        while cookie in [self.Clients[i].cookie for i in range(len(self.Clients))]  :
            cookie = str(uuid.uuid4)[:8]
        #Checker un conflit socketid ?
        self.Clients.append(Client(len(self.Clients),sid,cookie))
        await self.sio.emit('user_cookie', {'data': cookie}, room=sid)
        print("Nouveau client enregistré ! ")
        print(cookie)
        pass

    async def checkClient(self,sid,cookie,sio):
        if cookie["data"] in [self.Clients[i].cookie for i in range(len(self.Clients))]:
            await self.sio.emit('user_cookie_check', {'data': 'client_valide'}, room=sid)
        else:
            await self.sio.emit('user_cookie_check', {'data': 'client_invalide'}, room=sid)
        
    async def run(self,sio):
        while self.running == True:
            await self.sio.sleep(1/(self.fps)) # serveur a 60fps
            print("server running")
            #print("mavariable = ", self.mavariable)

    def setmavariable(self): #fonction test qui incrémente mavariable
        self.mavariable+=100


class ServeurHandler(socketio.AsyncNamespace):
    
    def __init__(self,addr,sio_,serveur_):
        super().__init__(addr)
        self.sio = sio_
        self.s = serveur_

    async def on_connect(self, sid, environ):
        await self.sio.emit('my_response', {'data': 'Connected', 'count': 0}, room=sid)

    def on_disconnect(self,sid):
        print('Client disconnected')
    
    def on_mon_event(self,sid,data):
        print("salut " + sid + " !");
        self.s.setmavariable();
        print(data)
    
    async def on_envoi_cookie(self,sid,data):
        await self.s.checkClient(sid,data,self.sio);
        

    async def on_mon_username(self,sid,data):
        await self.s.nouveauClient(sid,data,self.sio);
        