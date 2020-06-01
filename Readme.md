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

### Executer le serveur sur une ip et un port précis
> Executer la commande suivante (le port par défaut est 8000) : 

`$ cd server; python3 ./main.py --ip adresseip`
ou
`$ cd server; python3 ./main.py --ip adresseip:port`

> Lancer le client dans le navigateur : 
entrer l'URL http://addresseip:port

PS : Si votre serveur possede déjà un serveur http il peut être opportun de rediriger un port vers celui de l'application.
Par exemple sur un serveur apache, on peut ajouter dans le fichier de configuration httpd.conf:

`ProxyPass /path/to/koopt/repository/server http://adresseip:port`
