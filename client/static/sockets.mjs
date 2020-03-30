import {Client} from '/static/client.mjs'



//$(document).ready(function () {

    //npm i js-cookie
    //pip3 install socketio

    var client = new Client();
    var socket = io.connect();

    //Cookies.set("userid","6651a24c")
    //Cookies.remove("userid")
    socket.on('connect', function () {
        if (Cookies.get("userid") != undefined) { // Si le cookie est deja défini
            //trouver un moyen d'attendre la validation...
            socket.emit('envoi_cookie',{'data' : Cookies.get("userid")});
        }
        else{
            socket.emit('demande_etape',null)
        }
        //socket.emit('my_event', { data: 'I\'m connected!' });
    });
    socket.on('disconnect', function () {
        console.log('Disconnected');
    });

    /* Toutes les pages */

    socket.on('user_cookie_check',  function(data){
        client.cookie_check(data);
    })

    /* Page d'accueil */    

    socket.on('user_registration_cookie', function (msg) {
        client.home_registration(client,msg.data)
    });

    /* Page partie */
    socket.on('acces_partie',  function(data){
        client.partie_check(client,data);
    });

    /* Page lobby */
    socket.on('lobby',  function(data){
        client.lobby_update(client,data);
    });

    socket.on('game_start',  function(data){
        client.lobby_game_start(client,data);
    });


    
    /* Appel a la fonction toutes les 100ms */
window.setInterval((()=>client.affichage(socket)),60);
