#Importation de librairies
import asyncio
import uuid 

from sanic import Sanic
from sanic.response import html

import socketio



#Importation de fichiers du projet


from handler.ServerHandler import ServerHandler
from partie import Partie
import map
from joueur import Joueur
import ressource


class Server:
    ''' Classe principale de l'application '''

    Parties = []
    #Clients = [] # = [{id="",joueurid, cookieID, sid, autres...}]
    Joueurs = []
    
    def __init__(self,ip = None):
        self.running = True
        self.fps = 60 # Valeur de production plus proche de 60
        self.mavariable=0 # Variable test

        ''' Serveurs http et websocket '''
        self.sio = socketio.AsyncServer(async_mode='sanic')
        self.app = Sanic(name="koopt")
        self.sio.attach(self.app)
        self.ip = ip


    def start(self): 
        ''' Démarrage des serveurs et routage '''
        @self.app.listener('before_server_start')
        def before_server_start(sanic, loop):
            self.sio.start_background_task(self.run)

        @self.app.route('/')
        async def index(request):
            with open('../client/index.html') as f:
                return html(f.read())

        self.sio.register_namespace(ServerHandler('/',self.sio,self))
        self.app.static('/static', '../client/static')
        if self.ip is None:
            self.app.run()
        else:
            self.app.run(host=self.ip,port='8000')

    async def creerJoueur(self,sid,username):
        cookie = str(sid)[:8]
        '''
        while cookie in [self.Clients[i].cookie for i in range(len(self.Clients))]  :
            cookie = str(uuid.uuid4)[:8]
        '''
        #Checker un conflit socketid ?
        #Il faudrait vérifier si le nom est correct (different/non vide ...)
        j = Joueur(len(self.Joueurs),username,sid,cookie)
        self.Joueurs.append(j)
        await self.sio.emit('user_cookie', {'data': cookie}, room=sid)
        print("Nouveau client enregistré ! ")
        print(cookie)

        #Si tout est correct on envoie une validation au client
        await self.sio.emit('user_registration_cookie', {'data': cookie}, room=sid)
        j.etape=1
        #Sinon message d'erreur...     

        pass

    async def checkJoueur(self,sid,cookie):
        ''' fonction serveur vérifiant que l'utilisateur
        possède bien un identifiant(stocké ss forme de cookie) unique '''
        if cookie["data"] in [self.Joueurs[i].cookie for i in range(len(self.Joueurs))]:
            index = [self.Joueurs[i].cookie for i in range(len(self.Joueurs))].index(cookie["data"])
            self.Joueurs[index].reset_sid(sid)
            await self.sio.emit('user_cookie_check', {'data': 'client_valide','etape':self.Joueurs[index].etape}, room=sid)
        else:
            await self.sio.emit('user_cookie_check', {'data': 'client_invalide'}, room=sid)
    
    def getJoueur(self,sid):
        for i in range(len(self.Joueurs)):
            if self.Joueurs[i].socketid == sid:
                return i
        return -1 #erreur.. gérer l'exception ?

    async def creerPartie(self,sid,data):
        idJoueur = self.getJoueur(sid)
        j = self.Joueurs[idJoueur]
        self.Parties.append(Partie("partie"+str(idJoueur), idJoueur, self.sio,j))
        await self.sio.emit('acces_partie', "success", room=sid)
        j.etape=2
        pass

    async def rejoindrePartie(self,sid,data):
        idJoueur = self.getJoueur(sid)
        j = self.Joueurs[idJoueur]
        if(data.isdigit()):
            data= int(data)
            #idealement on conserve un lien entre les ids et les index dans la liste
            #idealement index != id et id pas forcement un entier
            if data < len(self.Parties):
                self.Parties[data].rejoindrePartie(j)
                await self.sio.emit('acces_partie', "success", room=sid)
                j.etape=2
            else:
                pass #Erreur, id de partie inexistant


    async def demarrerPartie(self,sid,data):
        idJoueur = self.getJoueur(sid)
        j = self.Joueurs[idJoueur]
        partie = j.partie
        await partie.start(j)

    def getPartie(self,sid):
        j = self.getJoueur(sid)
        if j != -1 :
            return self.Joueurs[j].partie
        return -1

    async def run(self):
        ''' boucle principale de la logique du serveur de jeu 
        cette boucle s'éxécute en parallèle des serveurs web'''
        while self.running == True:
            for p in self.Parties:
                await p.context()
            await self.sio.sleep(1/(self.fps)) # serveur a 60fps
            #print("server running")
            #print("mavariable = ", self.mavariable)

    def setmavariable(self): #fonction test qui incrémente mavariable
        self.mavariable+=100

#TODO Heriter de GameHandler qui gere uniquement les events gameplay

