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
        this.load.spritesheet("armel", "static/assets/armel.png", {frameHeight: 64, frameWidth: 64});
        this.load.spritesheet("fleche", "static/assets/fleche.png", {frameHeight: 40, frameWidth: 139});
        this.load.spritesheet("food", "static/assets/burger.png", {frameHeight: 64, frameWidth: 64});
        this.load.atlas("vegetation","static/assets/maps/sprite_objets.png","static/assets/maps/atlas_sprites.json")
        this.load.image('set', 'static/assets/maps/set.png');
        this.load.image('atlas', 'static/assets/maps/atlas.png');
        this.load.tilemapTiledJSON('map', 'static/assets/maps/map_finale.json');
    }
    create(){

        window.GameScene = this;

        /* Création de la scène */
        this.joueurs = [] // stocke 3 joueurs de numero diff de numero

        for(var i = 0; i<this.usernames.length;i++){
            if (i === this.numero){
                this.joueurs.push(new JoueurSprite(this,0,0,"armel",true,this.usernames[i]).setDepth(0))
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
        //this.collision2= map.createStaticLayer(3, tiles_atlas, 0, 0).setDepth(5);
        //this.physics.add.collider(this.joueurs[this.numero], this.collision);
        //this.physics.add.collider(this.mainplayer,this.collision)
        //map.setCollision([601])

        //this.arbre=map.createFromObjects("objets","arbre1",{key:'armel'})
        window.map=map
        this.objets = Array()
        
        map.filterObjects("objets",(param)=>{
                this.objets.push(param)
        })
        
        this.objets.filter((obj)=>obj.name=="arbre1").forEach((obj)=>{
            var object = new Object(this,obj.x,obj.y,"vegetation",obj.id,"arbre1")
            this.mapObjects.push(object)
            this.add.existing(object)
        })
        
        /* Gestion de la caméra */
        this.keyboard = this.input.keyboard.addKeys("Z, Q, S, D");
        this.arrowKey = this.input.keyboard.addKeys("SPACE");
        this.foodKey = this.input.keyboard.addKeys("F");
        this.hitKey = this.input.keyboard.addKeys("SPACE");
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
            this.energies.push(this.joueurs[i].healthbar.value)
            //console.log(this.joueurs[i].healthbar.value)
        }

      window.clearInterval(window.interval)

    }
    update(){
        /* Fonction appelée chaque frame */
        
        this.updateData();//à bien faire en premier
        
        this.sendData();
        
        this.updateObjects();
        
        this.updateHealth();       
        
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

    /*
    on_position_clock(){
        // Fonction callback horloge de position 
        this.actualiserPosition = true;
        
    }
    */
    updateObjects(){
        /* Fonction mettant à jour les joueurs et objets du jeu */
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
                //this.joueurs[nj].setPosition(this.pos[nj][0],this.pos[nj][1])
                //this.joueurs[nj].setVelocity(this.vel[nj][0],this.vel[nj][1])
            
            
            if (this.vel[nj] != undefined){
            this.joueurs[nj].velocity.x=this.vel[nj][0];//PROBLEME ICI LORSQU'IL Y A PLUSIEURS JOUEURS
            this.joueurs[nj].velocity.y=this.vel[nj][1];
            }
            else {
                this.vel[nj]=[0,0]
            }
            //this.joueurs[nj].setPosition(this.pos[nj][0],this.pos[nj][1])//this.pos[nj][1]
            //console.log(this.pos[nj][1])
            if(this.vel[nj] != undefined){ // si on a recu des donnees
                //this.joueurs[nj].setVelocity(this.vel[nj][0],this.vel[nj][1])
                //this.joueurs[nj].setPosition(this.pos[nj][0],this.pos[nj][1])
                //console.log("POS : ",this.joueurs[nj].x,this.joueurs[nj].y, "REC : ",this.pos[nj][0],this.pos[nj][1])
            }
            //console.log(this.vel[nj][0],this.vel[nj][1])
            
            
            this.manger=this.mainplayer.eatin;
            this.nourriture.x=this.mainplayer.x
            this.nourriture.y=this.mainplayer.y+10  
            this.nourriture.context(this);
            this.manger=this.nourriture.eating;
            this.joueurs[nj].context(this)
            
        }

        //this.fleche.update()
    }
    

    updateHealth(){
        for(var i =0; i< this.joueurs.length; i++){
            this.joueurs[i].healthbar.value=this.energies[i];
            if (this.joueurs[i].healthbar.value ===0){
                this.joueurs[i].alive= false
            }
            this.joueurs[i].healthbar.draw();
        }
        /*const e= new Date();
        this.secondes_passe=e.getTime()/1000-this.timestamp_ini;

        this.diff=parseInt(this.secondes_passe-this.last_update);
        if (this.diff>=1) {
            /*for(var nj = 0; nj < this.joueurs.length;nj++){
                this.joueurs[nj].damage(this.diff*0,1);
            }*/
           /* this.mainplayer.damage(-(this.diff*0.1));
            this.last_update=this.secondes_passe;

        }*/
    
    
        
        
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