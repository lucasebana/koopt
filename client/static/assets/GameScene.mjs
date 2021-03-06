import { cst } from '/static/assets/cst.mjs'
import {JoueurSprite} from '/static/assets/JoueurSprite.mjs'
import {Arrow} from '/static/assets/Arrow.mjs'
import { HealthBar } from './HealthBar.mjs'
import {Object} from '/static/assets/object.mjs'
import {Food} from '/static/assets/food.mjs'


export class GameScene extends Phaser.Scene{
    constructor(){
        super({
            key:"GAME"
        })
    }

    init(data){
        this.numero = null;
        this.usernames = []
        this.pos = []
        this.vel = [[]]
        this.objets=new Map();
        this.energies= []
        this.miam=100*5
        this.simpleAttack=false
        this.mapObjects = []
        this.wood=0
        this.end=0
        this.updateData();
    }
    preload(){
        /* Chargement des ressources/images */
        this.load.spritesheet("armel", "static/assets/armel.png", {frameHeight: 64, frameWidth: 64});
        this.load.spritesheet("fleche", "static/assets/fleche.png", {frameHeight: 40, frameWidth: 139});
        this.load.spritesheet("food", "static/assets/burger.png", {frameHeight: 64, frameWidth: 64});
        this.load.atlas("vegetation","static/assets/maps/sprite_objets.png","static/assets/maps/atlas_sprites.json")
        this.load.image('set', 'static/assets/maps/set.png');
        this.load.image('atlas', 'static/assets/maps/atlas.png');
        this.load.tilemapTiledJSON('map', 'static/assets/maps/map_finale.json');
    }
    create(){
        /* Initialisation d'objets du jeu */
        window.GameScene = this;

        /* Création de la scène */
        this.joueurs = []// stocke 3 joueurs de numero diff de numero

        for(var i = 0; i<this.usernames.length;i++){
            if (i === this.numero){
                this.joueurs.push(new JoueurSprite(this,0,0,"armel",true,this.usernames[i]).setDepth(2))
            }
            else{
                this.joueurs.push(new JoueurSprite(this,0,0,"armel",false,this.usernames[i]).setDepth(0))
            }
        }
        this.mainplayer  = this.joueurs[this.numero];
    
        /* Chargement de la map */
        var map = this.make.tilemap({ key: 'map' });
        var tiles = map.addTilesetImage('set', 'set');
        var tiles_atlas= map.addTilesetImage('terrain_atlas','atlas');
        this.layer = map.createStaticLayer(0, tiles, 0, 0).setDepth(-1);
        this.layer2 = map.createStaticLayer(1, [tiles,tiles_atlas], 0, 0).setDepth(1);

        //this.objets_image = map.createStaticLayer(2, tiles, 0, 0).setDepth(2);

        this.collision = map.createStaticLayer(2, tiles, 0, 0).setDepth(5);
        this.collision.visible = false

        window.map=map

        /* Initialisation d'objets des la map (arbres par ex.) */
        this.mapobjets = Array()
        
        map.filterObjects("objets",(param)=>{
                this.mapobjets.push(param)
        })
        
        this.mapobjets.filter((obj)=>obj.name=="arbre1").forEach((obj)=>{
            var object = new Object(this,obj.x,obj.y,"vegetation",obj.id,"arbre1")
            this.mapObjects.push(object)
            this.add.existing(object)
        })

        this.mapobjets.filter((obj)=>obj.name=="arbre2").forEach((obj)=>{
            var object = new Object(this,obj.x,obj.y,"vegetation",obj.id,"arbre2")
            this.mapObjects.push(object)
            this.add.existing(object)
        })
        
        /* Définition des touches */

        this.keyboard = this.input.keyboard.addKeys("Z, Q, S, D");
        this.arrowKey = this.input.keyboard.addKeys("SPACE");
        this.foodKey = this.input.keyboard.addKeys("F");
        this.hitKey = this.input.keyboard.addKeys("SPACE");

        
        /* Gestion de la caméra */
        this.cameras.main.startFollow(this.mainplayer,false, 0.2, 0.2);
        this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);
        this.scale.on("resize",this.resize,this)
        //this.positionClock = this.time.addEvent({loop:true,delay:20,callback:this.on_position_clock,callbackScope:this})
        this.actualiserPosition=true;

        /*Temps pour décroissance barre de vie, initialisation*/
        const e= new Date();
        this.secondes_passe=e.getTime()/1000-this.timestamp_ini;
        this.last_update=0;
        
        /*Food*/
        this.nourriture=new Food(this,this.mainplayer.x,this.mainplayer.y+10,"food");
        this.nourriture.visible=false

        /*Barres de vie*/
        for (var i=0; i<this.joueurs.length; i++){
            this.energies[i]=100
            //console.log(this.joueurs[i].healthbar.value)
        }

      window.clearInterval(window.interval)

    }
    update(){
        /* Fonction appelée chaque frame */
        
        this.updateData();
        
        this.sendData();
        
        this.updateHealth();
        
        this.updateObjects();
        
    }

    updateData(){
        /* Fonction mettant à jour les données issues du serveur */
        
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
        
        if("update_gameData" in d[n_data]){
            var e = []
            var t=d[n_data].update_gameData
            for(var i = 0; i< d[n_data].update_gameData.nrj.length; i++){
                e.push(t.nrj[i]);
            }
            this.energies= e;
            this.miam=t.food
            this.simpleAttack=t.simpleHit
            this.wood=t.bois
            this.end=t.fin
            if (this.end != 0){
                this.scene.stop()
            }
        }

        if("update_gameItems" in d[n_data]){
            for (var i=0;i<d[n_data].update_gameItems.length;i++){
                var obj=d[n_data].update_gameItems[i];
                //debugger
                if (this.objets.get(obj.id)==undefined){
                    var fleche=new Arrow(this,this.x,this.y,0);
                    fleche.setPosition(obj.x,obj.y)
                    this.objets.set(obj.id,fleche);
                }
                var tween = this.tweens.add({
                    targets: this.objets.get(obj.id),
                    props: {
                        x:obj.x,
                        y:obj.y
                    },
                    ease:"Bounce.easeInOut",
                    duration: 30
                });

            }
            

        }
        if("update_mapobjects" in d[n_data]){
            t=d[n_data].update_mapobjects
            for (var i=0;i<t.length;i++){
                var datai = t[i]
                this.mapObjects.find(element=>element.id == datai.id).setFrame(datai.name)
                if(datai.name == "" || 1==1){
                    var cx = this.cameras.main.scrollX
                    var cy = this.cameras.main.scrollY
                    var obj = this.mapObjects.find(element=>element.id == datai.id)
                    game.scene.getScene("INTERFACE").woodAnimation(obj.x - cx,obj.y - cy)
                }
            }
        }

        
        }
    }

    sendData(){
        /* Fonction envoyant les données au serveur */
        //window.gh.sendData("send_position",[this.mainplayer.x,this.mainplayer.y])
        //window.gh.sendData("send_vel",[this.mainplayer.realVelocity.x,this.mainplayer.realVelocity.y])
    }

    updateObjects(){

        /* Fonction mettant à jour les joueurs et objets du jeu */

        /* Mise à jour de la position des joueurs avec interpolation */
        for(var nj = 0; nj < this.joueurs.length;nj++){
            
                if(this.actualiserPosition == true || 1 == 1){
                    this.actualiserPosition = false;
                    if(this.pos[nj] != undefined){
                        //this.joueurs[nj].setPosition(this.pos[nj][0],this.pos[nj][1])

                        var x = this.pos[nj][0]
                        var y = this.pos[nj][1]


                        var tween = this.tweens.add({
                            targets: this.joueurs[nj],
                            props: {
                                x:x,
                                y:y
                            },
                            ease:"Bounce.easeInOut",
                            duration: 30
                        });
                    }
                }
            
            
            if (this.vel[nj] != undefined){
            this.joueurs[nj].velocity.x=this.vel[nj][0];
            this.joueurs[nj].velocity.y=this.vel[nj][1];
            }
            else {
                this.vel[nj]=[0,0]
            }            
            
            this.manger=this.mainplayer.eatin;
            this.nourriture.x=this.mainplayer.x
            this.nourriture.y=this.mainplayer.y+10  
            this.nourriture.context(this);
            this.manger=this.nourriture.eating;
            this.joueurs[nj].context(this)
            
        }
    }    

    updateHealth(){
        for(var i=0; i< this.joueurs.length; i++){
            if (this.energies[i] <= 0){
                    this.joueurs[i].alive = false
                }
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