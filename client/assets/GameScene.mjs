import { cst } from '/assets/cst.mjs'
import {JoueurSprite} from '/assets/JoueurSprite.mjs'

export class GameScene extends Phaser.Scene{
    constructor(){
        super({
            key:"GAME"
        })
    }

    init(data){
        console.log(data)
    }
    preload(){
        this.load.spritesheet("armel", "./assets/armel.png", {frameHeight: 64, frameWidth: 64});
        this.load.image('pkm', './assets//tilesetpkmnX.png');
        this.load.tilemapTiledJSON('map', './assets/map2.json');        
    }
    create(){
        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('pkm', 'pkm');
        this.layer = map.createStaticLayer(0, tiles, 0, 0);
        this.layer2 = map.createStaticLayer(1, tiles, 0, 0);

        this.armel = new JoueurSprite(this, 30, 40, "armel", 26);
        window.armel = this.armel;

        this.keyboard = this.input.keyboard.addKeys("Z, Q, S, D");
        
        this.cameras.main.roundPixels = true;
        this.cameras.main.startFollow(this.armel,true, 0.2, 0.2);
        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        
        this.scale.on("resize",this.resize,this)
    }
    update(){
        this.armel.context(this)        
    }

    resize(gameSize,baseSize,displaySize,resolution){
        console.log("GAMESCENE RESIZE ! ")
        /*var width = displaySize.width
        var height = baseSize.height
        var ar = displaySize.aspectRatio
        console.log(ar)
        //this.layer.ResizeWorld();
        //this.layer.setDisplaySize(width,height*ar)
        */
    }
}