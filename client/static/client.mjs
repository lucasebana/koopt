export class Client{
    constructor(){}
    etape = 0;
    etape_prec = null;

    affichage(client,socket){
        var c = client;
        if(c.etape != c.etape_prec){
        switch(c.etape){
            case 0:
                //affiche home.html et appelle le code correspondant à sa page
                c.loadPage("/static/home.html");
                c.home_page(socket)
                break;
            case 1: 
                //affiche partie.html
                c.loadPage("/static/partie.html");
                c.partie_page(socket)
                break;
            case 2:
                //affiche lobby.html
                c.loadPage("/static/lobby.html");
            case 3: 
                //affiche game.html et charge game.js
                break;
            default:
                console.log("Erreur d'affichage")
                break;
        }
        c.etape_prec = c.etape;
    }
    }

    loadPage(page){
        $("body").load(page);
    }

    /*  */

    cookie_check(client, data){
        if(data.data == "client_valide"){
            /*if  (client.etape == 0){
                client.etape = 1;
            }*/
            client.etape = data.etape
        }
        else{
            Cookies.remove("userid")
            //afficher message d'erreur...(message vide, etc..)
        }
    }

    /* scripts de navigation */
    home_page(socket){
        /* page d'accueil */        
        if (Cookies.get("userid") != undefined) { // Si le cookie est deja défini
            //trouver un moyen d'attendre la validation...
            socket.emit('envoi_cookie',{'data' : Cookies.get("userid")});
        
        }
        
        $(document).on("submit","form#username_form",function(event){
                    var d = $("input#username").val()
                    socket.emit("mon_username",{'data':d})
                    return false;
                });
    
    }

    

    home_registration(client,data){
        if(data != "erreur"){
            if (client.etape == 0)
                Cookies.set("userid",data)
                client.etape=1
        }
        else{
            console.log("Erreur page 0 : enregistrement")
        }
            
    }
    /* page dediee aux parties */
    partie_page(socket){
        $(document).on("click","#creer_partie",function(event){
            socket.emit("host_partie",null)
            return false;

        })
        $(document).on("submit","form#rejoindre_form",function(event){
            var d = $("input#id_partie").val()
            socket.emit("join_partie",d)
            return false;
        });


    }
    
    partie_check(client,data){
        if(data == "success" && client.etape == 1){
            client.etape = 2
        }
    }
}