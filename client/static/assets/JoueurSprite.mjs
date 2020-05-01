import { HealthBar } from './HealthBar.mjs'
export class JoueurSprite extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, playable,name, frame=0,healthbar) {
        super(scene, x, y, texture, frame);

        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        
        this.setScale(2);
        scene.physics.world.enableBody(this);
        this.setImmovable(true);

        this.playable = playable;
        this.orientation = 0;
        this.realVelocity = {
            x:0,
            y:0
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
        this.setSize(30, 52).setOffset(17, 12);

        /*
        this.body.offset.set(17,35)
        this.body.height = 60   
        */

        this.setCollideWorldBounds(true);
    }


    controlPlayer(scene){
        if (scene.keyboard.D.isDown === true) {
            this.setVelocityX(200);
        }

        if (scene.keyboard.Z.isDown === true) {
            this.setVelocityY(-200);
        }

        if (scene.keyboard.S.isDown === true) {
            this.setVelocityY(200);
        }

        if (scene.keyboard.Q.isDown === true) {
            this.setVelocityX(-200);
        }
        if (scene.keyboard.Q.isUp && scene.keyboard.D.isUp) { //not moving on X axis
            this.setVelocityX(0);
        }
        if (scene.keyboard.Z.isUp && scene.keyboard.S.isUp) { //not pressing y movement
            this.setVelocityY(0);
        }
    }

    setAnimation(){
        var vx = this.body.velocity.x;
        var vy = this.body.velocity.y;
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

        if(this.body.velocity.x > 0){
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
        }


    }
     //pour ne pas display plusieurs fois l'animation dans le update

    context(scene){
        //this.play("stretchD",true)
        if (this.alive===false && this.alr===false){
            this.play("death",true);
            this.alr=true;
            this.playable=false;
        }
        this.setAnimation()
        this.update();
        this.textname.setPosition(this.x - this.textname.width/2, this.y + this.height + 5)
        this.healthbar.bar.x=this.x - this.width/2 -2
        this.healthbar.bar.y=this.y - this.height 
        if (this.playable){
            this.controlPlayer(scene);
        }
    }
    damage (amount)
    {
        if (this.healthbar.decrease(amount))
        {
            this.alive = false;        
        }
    }



}