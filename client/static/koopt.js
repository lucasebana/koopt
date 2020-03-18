
$(document).ready(function () {

    //npm i js-cookie
    //pip3 install socketio

    var socket = io.connect();

    var checkUid = function () {
        return false;
    }

    socket.on('connect', function () {
        socket.emit('my_event', { data: 'I\'m connected!' });
    });
    socket.on('disconnect', function () {
        console.log('Disconnected');
    });
    socket.on('my_response', function (msg) {
        console.log('Received: ' + msg.data);
    });
    socket.on('user_cookie', function(msg) {
        console.log('Received: ' + msg.data);
    });
    var goto = "home"
    var current;

    function setPage() {
        if (goto != current) {
            switch (goto) {
                case "home":
                    {
                        if (Cookies.get("userid") == undefined) {
                            $("body").load("/static/home.html", function () { home_page(socket) });
                        }
                        else if (!checkUid()) {
                            $("body").load("/static/home.html", function () { home_page(socket) });
                        }
                        else {

                        }
                    }
                default:
                    {
                        $("body").html("salut")
                    }

                    goto = current;
            }
        }
    }
    if (current == "home"){
        socket.on('user_cookie', function(msg) {
            console.log('Received: ' + msg.data);
        });
    }
    window.setInterval(setPage, 1000);

});