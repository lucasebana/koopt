export class game_handler {
    constructor(client,socket,game){
        this.client = client
        this.socket = socket
        //this.game = game
        this.data = []
    }

    init_vars = {
        load_i : false,
        load_game:false
    }

    check_init(){
        var i = this.init_vars;
        console.log(i.load_i && i.load_game)
        return i.load_i && i.load_game;
    }

    callbacks() {
        self = this
        this.socket.on('load_i', function (data) {
            self.data.push({"load_i":data})
            self.init_vars.load_i = true;
        })

        this.socket.on('load_game', function (data) {
            self.data.push({"load_game":data})
            self.init_vars.load_game = true;
        })

        this.socket.on('update_pos', function(data){
            self.data.push({"update_pos":data})
        })


        this.socket.on('update_gameData', function(data){
            self.data.push({"update_gameData":data})
        })
        this.socket.on('update_gameItems', function(data){
            self.data.push({"update_gameItems":data})
        })
    }

    getData(){
        var d = this.data.slice();
        this.data.length = 0; // vide l'array
        //SAFE ????
        //proteger avec un while déverouillé..
        return d;
    }

    sendData(header,data){
        this.socket.emit(header, data)
    }

    
}