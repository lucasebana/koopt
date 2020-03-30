import { cst } from '/static/assets/cst.mjs'

import {GameScene} from '/static/assets/GameScene.mjs'
export class LoadScene extends Phaser.Scene{
    constructor(){
        super({
            key:"LOAD"
        })
    }
    init(data){
        console.log("INIT de LOADSCENE !")
    }
    preload(){

    }
    create(){
        this.scene.add("GAME",GameScene)
        this.scene.start("GAME", "parametre d'initialisation de GameScene")
        console.log("CREATE de LOADSCENE !")
    }
}