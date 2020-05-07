import { Game } from "./assets/game.mjs";

export class Client {
    etape = -1;
    etape_prec = null;
    stop = false;

    constructor() {
        $.get("static/home.html", function (data) {
            $(".container").append(data);
        });
        $.get("static/partie.html", function (data) {
            $(".container").append(data);
        });
        $.get("static/lobby.html", function (data) {
            $(".container").append(data);
        });

        $(document).on("click", "#logout", () => { Cookies.remove("userid"); location.reload(); })
    }
    affichage(socket) {
        if (this.etape != this.etape_prec && this.stop === false) {
            switch (this.etape) {
                case 0:
                    //affiche home.html et appelle le code correspondant à sa page
                    //c.loadPage("home");
                    //c.home();
                    this.home_page(socket)
                    break;
                case 1:
                    //affiche partie.html
                    this.partie_page(socket)
                    break;
                case 2:
                    this.lobby_page(socket)
                    break;
                case 3:
                    //affiche game.html et charge game.js
                    this.setup_game();
                    break;
                default:
                    //console.log("Erreur d'affichage")
                    //location.reload(); // ??????
                    break;
            }
            this.etape_prec = this.etape;
        }
        else if(this.etape === 4 && this.stop === false){
            /* le jeu n'est lancé que si les données d'initialisation sont recues... */
            this.start_game()
        }
    }

    cookie_check(data) {
        if (data.data == "client_valide") {
            /*if  (client.etape == 0){
                client.etape = 1;
            }*/
            this.etape = data.etape
        }
        else {
            Cookies.remove("userid")
            location.reload();
            //afficher message d'erreur...(message vide, etc..)
        }
    }

    /* scripts de navigation */
    home_page(socket) {
        /* page d'accueil */

        $(".home").fadeIn(0.6)
        $(".home").css("display", "block")
        $(".home #username_form").submit(function (event) {
            var d = $("input#username").val()
            socket.emit("mon_username", d)
            return false;
        });
    }

    home_registration(client, data) {
        if (data != "erreur") {
            if (client.etape == 0)
                Cookies.set("userid", data)
            client.etape = 1
        }
        else {
            console.log("Erreur page 0")
        }
    }


    /* page dediee aux parties */
    partie_page(socket) {
        $(".home").fadeOut(0.6)
        $(".partie").css("display", "block")
        $("#creer_partie").click(function (event) {
            socket.emit("host_partie", null)
            return false;
        })
        $("form#rejoindre_form").submit(function (event) {
            var d = $("input#id_partie").val()
            socket.emit("join_partie", d)
            return false;
        });

        $("#nom_utilisateur").text("(" + Cookies.get("userid") + ")")
    }
    partie_check(client, data) {
        if (data == "success" && client.etape == 1) {
            client.etape = 2
        }
    }
    /* page dediee aux lobbies */
    lobby_page(socket) {
        $(".home").css("display", "none")
        $(".partie").css("display", "none")
        $(".lobby").css("display", "block")

        $("#start_game").click(() => {
            socket.emit("start_partie", null)
        })
    }

    lobby_update(client, data) {
        //$("lobby_n_users").text("hello !")
        $("#lobby_name").text(data.nomSalle)
        var liste = [data.j0, data.j1, data.j2, data.j3]
        var n_utilisateurs = 0
        liste.forEach((element, i) => {
            if (element != null) {
                n_utilisateurs += 1
                $("#j" + String(i + 1)).text(element)
            }
        });
        $("#lobby_n_users").text(n_utilisateurs)
    }

    lobby_game_start(client, data) {
        client.etape = 3
    }

    /* fonctions dédiées au jeu */

    setup_game() {
        //this.stop = true
        $(".home").css("display", "none")
        $(".partie").css("display", "none")
        $(".lobby").css("display", "none")
        $('.container').css("display", "none")
        //this.game = new Phaser.Game(window.config)
        this.etape = 4
    }

    start_game(){
        if (gh.check_init() ) {
            this.stop = true;
            this.game = new Game(window.config, this.gh);
            window.game = this.game;
        }
    }

}
