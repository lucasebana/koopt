import socketio
class ServerHandler(socketio.AsyncNamespace):
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
    
    ''' Callbacks de navigation '''
    async def on_envoi_cookie(self,sid,data):
        await self.s.checkJoueur(sid,data);
        
    async def on_mon_username(self,sid,data):
        await self.s.creerJoueur(sid,data);

    async def on_host_partie(self,sid,data):
        await self.s.creerPartie(sid,data);
    
    async def on_join_partie(self,sid,data):
        await self.s.rejoindrePartie(sid,data);
    
    async def on_start_partie(self,sid,data):
        await self.s.demarrerPartie(sid,data);

    async def on_demande_etape(self,sid,data):
        await self.sio.emit('user_cookie_check', {'data': 'client_valide','etape':0}, room=sid) #a modifier : verifier que le sid n'est pas deja enregistré

    ''' Callbacks de gameplay '''
    ''' TODO: importer ces methodes d'un autre fichier '''
    async def on_send_position(self,sid,data):
        j = self.s.getJoueur(sid)
        p = self.s.getPartie(sid)
        if p != -1:
            p.setPosition(self.s.Joueurs[j],data)

