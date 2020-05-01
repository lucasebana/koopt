import { cst } from '/static/assets/cst.mjs'
import {InterfaceScene} from '/static/assets/InterfaceScene.mjs'
import {GameScene} from '/static/assets/GameScene.mjs'
export class LoadScene extends Phaser.Scene{
    constructor(){
        super({
            key:"LOAD"
        })
    }
    init(data){
        console.log("INIT de LOADSCENE !");
    }
    preload(){
        
    }
    create(){
        this.scene.add("GAME",GameScene)
        this.scene.add("INTERFACE",InterfaceScene)
        this.scene.start("GAME", "parametre d'initialisation de GameScene")
        this.scene.start("INTERFACE","parametre d'initialisation de InterfaceScene")
        console.log("CREATE de LOADSCENE !")
    }
}