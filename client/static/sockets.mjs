import {Client} from '/static/client.mjs'

$(document).ready(function () {

    //npm i js-cookie
    //pip3 install socketio
    var client = new Client()
    var socket = io.connect();


    Cookies.set("userid","39cd91cf")
    var cookieValable = client.checkClient(client,socket);
    Cookies.remove("userid")


    //window.setInterval(()=>client.setPage(client,socket), 1000);
    if (Cookies.get("userid") == undefined || !cookieValable) {
        client.loadPage("home",socket);
    }
    socket.on('connect', function () {
        socket.emit('my_event', { data: 'I\'m connected!' });
    });
    socket.on('disconnect', function () {
        console.log('Disconnected');
    });
    //window.setInterval(()=>console.log(client),100);
});