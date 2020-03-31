import { cst } from '/static/assets/cst.mjs'
import {JoueurSprite} from '/static/assets/JoueurSprite.mjs'

export class GameScene extends Phaser.Scene{
    constructor(){
        super({
            key:"GAME"
        })
    }

    init(data){
        console.log(data)
        this.initialisation = false; // initialisation a chaque envoi ? 
        this.numero = null;
        this.usernames = []
        this.pos = []

        this.updateData();
    }
    preload(){
        this.load.spritesheet("armel", "static/assets/armel.png", {frameHeight: 64, frameWidth: 64});
        this.load.image('pkm', 'static/assets/tilesetpkmnX.png');
        this.load.tilemapTiledJSON('map', 'static/assets/map2.json');    
        
        /* TODO : organiser les données */
    }
    create(){
        //this.armel = new JoueurSprite(this, 30, 40, "armel", 26).setDepth(0);
        this.joueurs = [] // stocke 3 joueurs de numero diff de numero

        for(var i = 0; i<this.usernames.length;i++){
            if (i === this.numero){
                this.joueurs.push(new JoueurSprite(this,30,40,"armel",true,this.usernames[i]).setDepth(0))
            }
            else{
                this.joueurs.push(new JoueurSprite(this,30,40,"armel",false,this.usernames[i]).setDepth(0))
            }
        }


        for(var i=0; i < 3; i++){
            if(i != this.numero){
                console.log(i)
            }
        }

        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('pkm', 'pkm');
        this.layer = map.createStaticLayer(0, tiles, 0, 0).setDepth(-1);
        this.layer2 = map.createStaticLayer(1, tiles, 0, 0).setDepth(1);


        
        //var txt = this.add.text(0, 0, 'hello');
        
        //window.armel = this.armel;

        this.keyboard = this.input.keyboard.addKeys("Z, Q, S, D");
        
        //this.cameras.main.roundPixels = true;
        this.cameras.main.startFollow(this.joueurs[this.numero],true, 0.2, 0.2);
        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        
        this.scale.on("resize",this.resize,this)
    }
    update(){
        this.updateData();
        this.sendData();
        this.updateObjects();
    }


    updateData(){ /* a benchmarquer ? */
       var d = window.gh.getData()
       for (var n_data = 0; n_data < d.length; n_data++){
        if("load_i" in d[n_data]){
            this.numero = d[n_data].load_i.numero;
        }
        if("load_game" in d[n_data]){
            this.usernames = d[n_data].load_game.noms;
            var p = []
            var t = d[n_data].load_game
            for(var i = 0; i < d[n_data].load_game.posx.length;i++){
                p.push([t.posx[i],t.posy[i]]);
            }
            this.pos = p;
            
        }
        
        }
    }

    sendData(){
        window.gh.sendData("send_position",[this.joueurs[this.numero].x,this.joueurs[this.numero].y])
    }


    updateObjects(){
        for(var nj = 0; nj < this.joueurs.length;nj++){
            if(this.numero != nj){
                this.joueurs[nj].setPosition(this.pos[nj][0],this.pos[nj][1])
            }
            this.joueurs[nj].context(this)            
        }
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