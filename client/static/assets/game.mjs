import {cst} from '/static/assets/cst.mjs'
import {LoadScene} from '/static/assets/LoadScene.mjs'


var config = {
    type: Phaser.AUTO,/*WebGL */
    width: 800,
    height: 600,
    parent:"b",
    //roundPixels: true,
    scene:[
        LoadScene
    ],

    render:{
        pixelArt:true,
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    }

};

config.height = document.getElementById("b").clientHeight;//ou offsetHeight ? 
config.width = document.getElementById("b").clientWidth;//ou offsetHeight ? 
window.config = config


export class Game extends Phaser.Game{
    constructor(config, Handler){
        super(config)
        this.Handler = Handler;

        this.number = null;
        this.names = null
        this.name = null;
        
    }
    init(){
        console.log("isRunning : " + this.isRunning)
        console.log("init de Game !")
    }
    /*
    init_self(data){
        this.number = data.numero
    }
    init_game(data){
        this.names = data.names
    }
    updateSelf(data){
        /* mise a jour de ses propres infos /
    }
    updatePlayers(data){
        /* mise a jour des infos des autres joueurs /
    }
    */
    
}
//var game = new Phaser.Game(config)