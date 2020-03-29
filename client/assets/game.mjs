import {cst} from '/assets/cst.mjs'
import {LoadScene} from '/assets/LoadScene.mjs'
var config = {
    type: Phaser.WebGL,
    width: 800,
    height: 600,
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


var game = new Phaser.Game(config)