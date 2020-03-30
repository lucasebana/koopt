import {cst} from '/static/assets/cst.mjs'
import {LoadScene} from '/static/assets/LoadScene.mjs'
i

var config = {
    type: Phaser.WebGL,
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
            debug: true
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
    }
}
//var game = new Phaser.Game(config)