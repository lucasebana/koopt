import { HealthBar } from './HealthBar.mjs'
import {Arrow} from './Arrow.mjs'
import {Food} from './food.mjs'
export class JoueurSprite extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, playable,name, frame=0) {
        super(scene, x, y, texture, frame);

        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        
        scene.physics.world.enableBody(this);
        this.setImmovable(true);


        /*this.displayHeight = 60*2
        this.displayWidth = 120
        */
        this.setOffset(0,0)
        this.body.width = 60
        this.body.height = 60
        this.setOrigin(0,0)
        
        
        this.eatin=false;
        this.eatin_old=false;

        this.hitting=false;
        this.hitting_old=false;
        
        
        this.indice=-1
        

        this.playable = playable;
        this.orientation = 0;

        this.velocity = {
            x:0,
            y:0
        }

        this.deplacement_serveur = {
            x:0,
            y:0,
            xold:0,
            yold:0
        }


        /* orientation :
            0 : haut
            1 : droite
            2 : bas
            3 : gauche        
        */
        
        scene.anims.create({
            key: "stretchU",
            frameRate: 10,
            frames: scene.anims.generateFrameNumbers("armel", {
                start: 0,
                end: 6
            })
        });
        scene.anims.create({
            key: "stretchL",
            frameRate: 10,
            frames: scene.anims.generateFrameNumbers("armel", {
                start: 13,
                end: 19
            })
        });
        scene.anims.create({
            key: "stretchD",
            frameRate: 10,
            frames: scene.anims.generateFrameNumbers("armel", {
                start: 26,
                end: 32
            })
        });
        scene.anims.create({
            key: "stretchU",
            frameRate: 10,
            frames: scene.anims.generateFrameNumbers("armel", {
                start: 0,
                end: 6
            })
        });

        scene.anims.create({
            key: "danseVictoire",
            frameRate: 10,
            frames: scene.anims.generateFrameNumbers("armel", {
                start: 195,
                end: 199
            })
        })
        
        
        scene.anims.create({
            key: "death",
            frameRate: 10,
            frames: scene.anims.generateFrameNumbers("armel", {
                start: 262,
                end: 265
            })
        }) 

        scene.anims.create({//voir pour faire selon l'orientation
            key: "hitU",
            frameRate: 10,
            frames: scene.anims.generateFrameNumbers("armel",{
                start: 159,
                end: 160
            })
        })

        scene.anims.create({//voir pour faire selon l'orientation
            key: "hitL",
            frameRate: 10,
            frames: scene.anims.generateFrameNumbers("armel",{
                start: 172,
                end: 173
            })
        })
        
        scene.anims.create({//voir pour faire selon l'orientation
            key: "hitD",
            frameRate: 10,
            frames: scene.anims.generateFrameNumbers("armel",{
                start: 185,
                end: 186
            })
        })

        scene.anims.create({//voir pour faire selon l'orientation
            key: "hitR",
            frameRate: 10,
            frames: scene.anims.generateFrameNumbers("armel",{
                start: 197,
                end: 199
            })
        })

        
    
        

        this.name = name;
        this.textname = scene.add.text(this.x - this.width /2 , this.y + this.height, this.name, 
        { font: '16px Courier', fill: '#FFFFFF', backgroundColor:"#000000", align:'center'}
        );

        this.textname.setPosition(this.x - this.textname.width /2 , this.y + this.height+5)

        this.textname.setDepth(20)
        
        
        this.healthbar = new HealthBar(scene,this.x - this.width/2 - 2, this.y-this.height,100)
        this.healthbar.bar.setDepth(20)
        this.alive=true
        this.alr= false

        //set smaller hitbox
        //this.setSize(30, 52).setOffset(17, 12);

        /*
        this.body.offset.set(17,35)
        this.body.height = 60   
        */

        //this.setCollideWorldBounds(true);
        //this.fleche=null;

        //W : 60
        //H:60
        //OFFSET : 17,34
        //this.body.setOffset(17,34)
        //this.body.setOrigin(0,0)
        
    }


    controlPlayer(scene){
        
        //if (scene.keyboard.D.isUp === true) {
        if (scene.keyboard.Z.isUp === true) {
            //this.setVelocityX(200);
                this.deplacement_serveur.y = 0
        }

        if (scene.keyboard.D.isUp === true) {
            //this.setVelocityX(200);
                this.deplacement_serveur.x = 0
        }
        if (scene.keyboard.S.isUp === true) {
            //this.setVelocityX(200);
                this.deplacement_serveur.y = 0
        }

        if (scene.keyboard.Q.isUp === true) {
            //this.setVelocityX(200);
                this.deplacement_serveur.x = 0
        }

        
        //if (scene.keyboard.D.isUp === true) {
        
        if (scene.keyboard.Z.isDown === true) {
            //this.setVelocityX(200);
                this.deplacement_serveur.y = -1
        }
        if (scene.keyboard.D.isDown === true) {
            //this.setVelocityX(200);
                this.deplacement_serveur.x = 1
        }
        if (scene.keyboard.S.isDown === true) {
            //this.setVelocityX(200);
                this.deplacement_serveur.y = 1
        }
        if (scene.keyboard.Q.isDown === true) {
            //this.setVelocityX(200);
                this.deplacement_serveur.x = -1
        }


        if(this.deplacement_serveur.y != this.deplacement_serveur.yold){
            if (this.deplacement_serveur.y == -1){
                window.gh.sendData("move",0)
            }
            if (this.deplacement_serveur.y == 1){
                window.gh.sendData("move",2)
            }

            if (this.deplacement_serveur.y == 0){
                window.gh.sendData("move",0+4)
            }
        }
        if(this.deplacement_serveur.x != this.deplacement_serveur.xold){
            
            if (this.deplacement_serveur.x == 1){
                window.gh.sendData("move",1)
            }
            
            if (this.deplacement_serveur.x == -1){
                window.gh.sendData("move",3)
            }
            
            if (this.deplacement_serveur.x == 0){
                window.gh.sendData("move",1+4)
            }
        }
        
        if (scene.foodKey.F.isDown === true){
            this.eatin=true
        }

        if (scene.foodKey.F.isUp === true){
            
            this.eatin=false
        }

        if (this.eatin != this.eatin_old){
            window.gh.sendData("eatin",this.eatin)
            this.eatin_old=this.eatin
        }

        
        
        this.deplacement_serveur.xold = this.deplacement_serveur.x
        this.deplacement_serveur.yold = this.deplacement_serveur.y
       
        /*if (scene.foodKey.F.isDown===true){
            this.eatin=true
            this.quantite_nourriture=5
            this.ratio=10
            this.food=game.scene.getScene("INTERFACE").foodbar;
            
            if (this.food.value < this.quantite_nourriture)
            {
                
                if (this.healthbar.value+(this.food.value/this.ratio)<this.healthbar.value_init){
                    this.food.delta(-(this.food.value));
                    this.healthbar.delta(this.food.value/this.ratio)
                }
            }
            else{              
                if (this.healthbar.value+(this.quantite_nourriture/this.ratio)<this.healthbar.value_init){
                    this.food.delta(-(this.quantite_nourriture));
                    this.healthbar.delta(this.quantite_nourriture/this.ratio);
                }              
            }
            
        }*/
    }
    attack(){
        if (this.scene.hitKey.SPACE.isDown===true){
            
            this.hitting=true
        }
        if (this.scene.hitKey.SPACE.isUp===true){
            
            this.hitting=false
        }
        if(this.hitting != this.hitting_old){
            
            window.gh.sendData("attack",this.hitting)
            //window.gh.sendData("arrow",1)   
            //this.fleche=new Arrow(scene,this.x,this.y,0);
            //this.fleche.setOrigin(0,0)
            this.hitting_old=this.hitting
        } 


    }

    setAnimation(){
        var vx = this.velocity.x;
        var vy = this.velocity.y;
        if(vy < 0){
            this.orientation = 0;
            
        }else if(vy > 0){
            this.orientation = 2;
        }
        else{
            if(vx > 0){
                this.orientation = 1;
            }
            else if (vx < 0){
                this.orientation = 3;
            }
        }

        if(vx == 0 && vy == 0){
            //set idle animation
        }
        else{
            
            this.flipX = false;
            switch(this.orientation){
                case 0:
                    this.play("stretchU",true)
                    break;
                case 1:
                    this.play("stretchL",true)
                    this.flipX = true;
                    break;
                case 2:
                    this.play("stretchD",true)
                    break;
                case 3:
                    this.play("stretchL",true)
                    break;
            }
        }

        /*if(this.body.velocity.x > 0){
            if(this.body.blocked.right){
                this.realVelocity.x = 0;
            }else{
                this.realVelocity.x = this.body.velocity.x;
            }
        }
        else if(this.body.velocity.x < 0){
            if(this.body.blocked.left){
                this.realVelocity.x = 0;
            }else{
                this.realVelocity.x = this.body.velocity.x;
            }
        }
        else{
            this.realVelocity.x = 0
        }
        if(this.body.velocity.y > 0){
            if(this.body.blocked.top){
                this.realVelocity.y = 0;
            }else{
                this.realVelocity.y = this.body.velocity.y;
            }
        }
        else if(this.body.velocity.y < 0){
            if(this.body.blocked.bottom){
                this.realVelocity.y = 0;
            }else{
                this.realVelocity.y = this.body.velocity.y;
            }
        }
        else{
            this.realVelocity.y = 0
        }*/


    }
     

    context(scene){
        //this.play("stretchD",true)
        if (this.alive===false && this.alr===false){
            this.play("death",true);
            this.alr=true;
            this.playable=false;
        }
        this.eatin=game.scene.getScene("GAME").manger
        this.serverAttack=game.scene.getScene("GAME").simpleAttack
        if (this.indice === -1){
            this.tab_joueurs=game.scene.getScene("GAME").joueurs
            //console.log(this.tab_joueurs)
            for (var i=0; i<this.tab_joueurs.length; i++){
                if (this.tab_joueurs[i] === this){
                    this.indice=i
                }
            }
        }
        //le serveur permet de savoir si on fait une simple attaque ou si on utilise une flèche
        

        

        /* orientation :
            0 : haut
            1 : droite
            2 : bas
            3 : gauche        
        */

        this.setAnimation()
        
        if (this.serverAttack === this.indice ){
            this.flipX=false
            
            switch(this.orientation){
                case 0:
                    this.play("hitU",true)
                    break
                case 1:
                    this.play("hitL",true)
                    this.flipX=true
                    break
                case 2:
                    this.play("hitD",true)
                    break
                case 3:
                    this.play("hitL",true)
                    break
            }//ne fonctionne pas à régler
            
        }
        this.textname.setPosition(this.x - this.textname.width/2, this.y + this.height + 5)
        this.healthbar.bar.x=this.x - this.width/2 -2
        this.healthbar.bar.y=this.y - this.height 
        if (this.playable){
            this.controlPlayer(scene);
            this.attack();
        }
        if(this.fleche != null){
            this.fleche.update();
        }
        this.update();
    }

    damage (amount)
    {
        if (this.healthbar.delta(amount))
        {
            this.alive = false;        
        }
    }



}