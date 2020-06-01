KOOPT
-----
Jeu multijoueur en ligne utilisant la technologie socket.io.<br/>
Serveur codé en python3 avec entre autre la librairie python-socketio et le serveur http Sanic.

https://github.com/lucasebana/koopt

Installation
------------

> Installer python-socketio et sanic:

`$ pip3 install python-socketio sanic`

Utilisation
-----------

### Executer le serveur localement: 
> Se déplacer vers le dossier server et lancer l'application:

`$ cd server; python3 ./main.py`

> Lancer le client dans le navigateur : 
entrer l'URL http://localhost:8000

### Executer à une ip et un port précis
> Executer la commande suivante(le port par défaut est 8000) : 

`$ cd server; python3 ./main.py --ip addresseip`
ou
`$ cd server; python3 ./main.py --ip addresseip:port`

> Lancer le client dans le navigateur : 
entrer l'URL http://addresseip:port

