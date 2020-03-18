export class Client{
    constructor(){}
    cookieValable=false;
    goto = "home";
    current = null;
    loadPage(page,socket){
        switch(page){
            case "home":
                $("body").load("/static/home.html", function () { home_page(socket) });
                break;
            default:
                break;
        }
    }
    async checkClient(client,socket){
        if (Cookies.get("userid") != undefined){
            socket.emit('envoi_cookie',{data : Cookies.get("userid")});
            await (async() =>(await socket.on('user_cookie_check',  (msg)=> {
                if(msg.data = "client_valide"){
                    client.cookieValable=true;
                }
            })))()
            //ON DOIT ATTENDRE LA REP ???

        }
        return client.cookieValable
    }
    setPage(client,socket){
        //Pas this... ok js
        if(client.current != client.goto){
            switch (client.goto) {
                case "home":
                    
                    if (Cookies.get("userid") == undefined) {
                        $("body").load("/static/home.html", function () { home_page(socket) });
                    }
                    else if (!checkUid()) {
                        $("body").load("/static/home.html", function () { home_page(socket) });
                    }
                    else {
                        //Page suivante
                    }
                    break;
                default:
                    {
                        $("body").html("salut")
                    }


            }
            
            client.current = client.goto;
        }
    }
}

//var client = new Client()
