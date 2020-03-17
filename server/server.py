import asyncio

from sanic import Sanic
from sanic.response import html

import socketio

class Server:
    def __init__(self): #demarrage sur serveur socket.io
        self.running = True
        self.fps = 1
        self.mavariable=0


    def creerPartie():
        pass

    def nouveauClient():
        pass


    async def run(self,sio):
        while self.running == True:
            await sio.sleep(1/(self.fps)) # serveur a 60fps
            print("server running" + str(self.mavariable))

    def setmavariable(self):
        self.mavariable+=100

    Parties = []
    Clients = [] # = [{id="",joueurid, cookieID, autres...}]


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