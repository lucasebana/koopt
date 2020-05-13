import {Client} from '/static/client.mjs'

var client = new Client();
var socket = io.connect();

import {home_callbacks} from '/static/home_callbacks.mjs'
import {game_handler} from '/static/game_handler.mjs'
/* chargement des callbacks des evenements serveur */

home_callbacks(client,socket)
window.gh = new game_handler(client,socket,client.game)
gh.callbacks()

/* Appel a la fonction de rafraichissement de l'accueil toutes les 100ms */
window.interval = window.setInterval((()=>client.affichage(socket)),60);