import asyncio
import uuid 

from sanic import Sanic
from sanic.response import html

import socketio

from client import Client


class Server:
    
    Parties = []
    Clients = [] # = [{id="",joueurid, cookieID, autres...}]
    def __init__(self): #demarrage sur serveur socket.io
        self.running = True
        self.fps = 1
        self.mavariable=0


    def creerPartie():
        pass

    async def nouveauClient(self,sid,username,sio):
        cookie = str(uuid.uuid4())[:8]
        while cookie in [self.Clients[i].cookie for i in range(len(self.Clients))]  :
            cookie = str(uuid.uuid4)[:8]

        self.Clients.append(Client(len(self.Clients),sid,cookie))
        await sio.emit('user_cookie', {'data': cookie}, room=sid)
        print("Nouveau client enregistré ! ")
        print(cookie)
        pass

    async def checkClient(self,sid,cookie,sio):
        if cookie["data"] in [self.Clients[i].cookie for i in range(len(self.Clients))]:
            await sio.emit('user_cookie_check', {'data': 'client_valide'}, room=sid)
        else:
            await sio.emit('user_cookie_check', {'data': 'client_invalide'}, room=sid)
        
    async def run(self,sio):
        while self.running == True:
            await sio.sleep(1/(self.fps)) # serveur a 60fps
            print("server running" + str(self.mavariable))

    def setmavariable(self):
        self.mavariable+=100



s = Server();

class ServeurHandler(socketio.AsyncNamespace):
    
    async def on_connect(self, sid, environ):
        await sio.emit('my_response', {'data': 'Connected', 'count': 0}, room=sid)

    def on_disconnect(self,sid):
        print('Client disconnected')
    
    def on_mon_event(self,sid,data):
        print("salut " + sid + " !");
        s.setmavariable();
        print(data)
    
    async def on_envoi_cookie(self,sid,data):
        await s.checkClient(sid,data,sio);
        

    async def on_mon_username(self,sid,data):
        await s.nouveauClient(sid,data,sio);
        


sio = socketio.AsyncServer(async_mode='sanic')
app = Sanic(name="koopt")
sio.attach(app)


@app.listener('before_server_start')
def before_server_start(sanic, loop):
    sio.start_background_task(s.run,sio)


@app.route('/')
async def index(request):
    with open('../client/index.html') as f:
        return html(f.read())

sio.register_namespace(ServeurHandler('/'))
app.static('/static', '../client/static')

if __name__ == '__main__':
    app.run()