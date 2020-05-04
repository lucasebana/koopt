import { cst } from '/static/assets/cst.mjs'
import {JoueurSprite} from '/static/assets/JoueurSprite.mjs'
import {Arrow} from '/static/assets/Arrow.mjs'

export class GameScene extends Phaser.Scene{
    constructor(){
        super({
            key:"GAME"
        })
    }

    init(data){
        console.log(data)
        this.numero = null;
        this.usernames = []
        this.pos = []
        this.vel = []
        this.updateData();
    }
    preload(){
        this.load.spritesheet("armel", "static/assets/armel.png", {frameHeight: 64, frameWidth: 64});
        this.load.spritesheet("fleche", "static/assets/fleche.png", {frameHeight: 40, frameWidth: 139});
        this.load.image('pkm', 'static/assets/tilesetpkmnX.png');
        this.load.tilemapTiledJSON('map', 'static/assets/map4.json');
    }
    create(){

        window.GameScene = this;

        /* Création de la scène */
        this.joueurs = [] // stocke 3 joueurs de numero diff de numero

        for(var i = 0; i<this.usernames.length;i++){
            if (i === this.numero){
                this.joueurs.push(new JoueurSprite(this,30,40,"armel",true,this.usernames[i]).setDepth(0))
            }
            else{
                this.joueurs.push(new JoueurSprite(this,30,40,"armel",false,this.usernames[i]).setDepth(0))
            }
        }
        this.mainplayer  = this.joueurs[this.numero];
        //this.fleche=new Arrow(this,20,20,0);

        /* Chargement de la map */
        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('pkm', 'pkm');
        this.layer = map.createStaticLayer(0, tiles, 0, 0).setDepth(-1);
        this.layer2 = map.createStaticLayer(1, tiles, 0, 0).setDepth(1);

        //this.objets_image = map.createStaticLayer(2, tiles, 0, 0).setDepth(2);

        this.collision = map.createStaticLayer(2, tiles, 0, 0).setDepth(5);
        //this.physics.add.collider(this.joueurs[this.numero], this.collision);
        this.physics.add.collider(this.mainplayer,this.collision)
        map.setCollision([601])

        
        /* Gestion de la caméra */
        this.keyboard = this.input.keyboard.addKeys("Z, Q, S, D");
        this.arrowKey = this.input.keyboard.addKeys("SPACE");
        this.cameras.main.startFollow(this.mainplayer,false, 0.2, 0.2);
        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.scale.on("resize",this.resize,this)
        this.positionClock = this.time.addEvent({looxp:true,delay:2500,callback:this.on_position_clock,callbackScope:this})
        this.actualiserPosition=true;


      

    }
    update(){
        /* Fonction appelée chaque frame */
        this.updateData();
        this.sendData();
        this.updateObjects();        
    }

    updateData(){
        /* Fonction mettant à jour les données issues du serveur */
        /* a benchmarquer ? */
       var d = window.gh.getData()
       for (var n_data = 0; n_data < d.length; n_data++){
        if("load_i" in d[n_data]){
            this.numero = d[n_data].load_i.numero;
            this.timestamp_ini=d[n_data].load_i.timestampinit;
        }
        if("load_game" in d[n_data]){
            this.usernames = d[n_data].load_game.noms;
            var p = []
            var v = []
            var t = d[n_data].load_game
            for(var i = 0; i < d[n_data].load_game.posx.length;i++){
                p.push([t.posx[i],t.posy[i]]);
                v.push([t.velx[i],t.vely[i]]);
            }
            //this.pos = p;
            //this.vel = v;            
        }
        if("update_pos" in d[n_data]){
            var p = []
            var v = []
            var t = d[n_data].update_pos
            for(var i = 0; i < d[n_data].update_pos.posx.length;i++){
                p.push([t.posx[i],t.posy[i]]);
                v.push([t.velx[i],t.vely[i]]);
                //console.log(t.posx[i],t.posy[i])
            }
            this.pos = p;
            this.vel = v;   
        }
        }
    }

    sendData(){
        /* Fonction envoyant les données au serveur */
        window.gh.sendData("send_position",[this.mainplayer.x,this.mainplayer.y])
        window.gh.sendData("send_vel",[this.mainplayer.realVelocity.x,this.mainplayer.realVelocity.y])
    }

    on_position_clock(){
        /* Fonction callback horloge de position */
        this.actualiserPosition = true;
    }
    
    updateObjects(){
        /* Fonction mettant à jour les joueurs et objets du jeu */
        for(var nj = 0; nj < this.joueurs.length;nj++){
            if(this.numero != nj){
                if(this.actualiserPosition == true){
                    this.actualiserPosition = false;
                    this.joueurs[nj].setPosition(this.pos[nj][0],this.pos[nj][1])
                }
                this.joueurs[nj].setPosition(this.pos[nj][0],this.pos[nj][1])
                //this.joueurs[nj].setVelocity(this.vel[nj][0],this.vel[nj][1])
            }
            this.joueurs[nj].context(this)            
        }
        //this.fleche.update()
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