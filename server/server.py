import asyncio

from sanic import Sanic
from sanic.response import html

import socketio

class Server:
    def __init__(self): #demarrage sur serveur socket.io
        self.running = True
        self.fps = 60

    def creerPartie():
        pass

    def nouveauClient():
        pass


    async def run(self,sio):
        while self.running == True:
            await sio.sleep(1/self.fps) # serveur a 60fps
            print("server running")

    Parties = []
    Clients = [] # = [{id="",joueurid, cookieID, autres...}]
    
sio = socketio.AsyncServer(async_mode='sanic')
app = Sanic(name="koopt")
sio.attach(app)

s = Server();

@app.listener('before_server_start')
def before_server_start(sanic, loop):
    sio.start_background_task(s.run,sio)


@app.route('/')
async def index(request):
    with open('socket1.html') as f:
        return html(f.read())

@sio.on('mon_event')
async def ma_fonction(sid,message):
    print("salut " + sid + " !");
    print(message)


@sio.event
async def connect(sid, environ):
    await sio.emit('my_response', {'data': 'Connected', 'count': 0}, room=sid)
    #return False : connexion refusée ??

@sio.event
def disconnect(sid):
    print('Client disconnected')


app.static('/static', './static')


if __name__ == '__main__':
    app.run()