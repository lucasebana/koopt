export class Client{
    etape = 0;
    etape_prec = null;

    

    constructor(){
        $.get( "static/home.html", function( data ) {
            $(".container").append(data);
          });
          $.get( "static/partie.html", function( data ) {
            $(".container").append(data);
          });
          $.get( "static/lobby.html", function( data ) {
            $(".container").append(data);
          });
          
        $(document).on("click","#logout",()=>{Cookies.remove("userid");location.reload();})
    }
    affichage(client,socket){
        var c = client;

        if(c.etape != c.etape_prec){
        switch(c.etape){
            case 0:
                //affiche home.html et appelle le code correspondant à sa page
                //c.loadPage("home");
                //c.home();
                c.home_page(socket)
                break;
            case 1: 
                //affiche partie.html
                c.partie_page(socket)
                break;
            case 2:
                c.lobby_page(socket)
                break;
            case 3: 
                //affiche game.html et charge game.js
                c.run_game(c);
                break;
            default:
                console.log("Erreur d'affichage")
                break;
        }
        c.etape_prec = c.etape;
    }
    }
    
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
        
        $(".home #username_form").submit(function(event){
                    var d = $("input#username").val()
                    socket.emit("mon_username",d)
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
            console.log("Erreur page 0")
        }
    }


    /* page dediee aux parties */
    partie_page(socket){
        $(".home").fadeOut(0.6)
        $(".partie").css("display","block")
        $("#creer_partie").click(function(event){
            socket.emit("host_partie",null)
            return false;
        })
        $("form#rejoindre_form").submit(function(event){
            var d = $("input#id_partie").val()
            socket.emit("join_partie",d)
            return false;
        });

        $("#nom_utilisateur").text("("+Cookies.get("userid")+")")
    }
    partie_check(client,data){
        if(data == "success" && client.etape == 1){
            client.etape = 2
        }
    }
    /* page dediee aux lobbies */
    lobby_page(socket){
        $(".home").css("display","none")
        $(".partie").css("display","none")
        $(".lobby").css("display","block")
        
        $("#start_game").click(()=>{
            socket.emit("start_partie",null)
        })
    }

    lobby_update(client,data){
        //$("lobby_n_users").text("hello !")
        $("#lobby_name").text(data.nomSalle)
        var liste = [data.j0,data.j1,data.j2,data.j3]
        var n_utilisateurs = 0
        console.log(liste)
        liste.forEach((element,i) => {
            if(element != null){
                n_utilisateurs+=1
                $("#j" + String(i+1)).text(element)
            }
        });
        $("#lobby_n_users").text(n_utilisateurs)

    }

    lobby_game_start(client,data){
        client.etape = 3
    }

    /* fonctions dédiées au jeu */

    run_game(client){
        $(".home").css("display","none")
        $(".partie").css("display","none")
        $(".lobby").css("display","none")
        $("canvas").css("display","block")
    }

}
