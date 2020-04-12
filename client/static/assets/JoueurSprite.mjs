export class JoueurSprite extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, playable,name, frame=0) {
        super(scene, x, y, texture, frame);

        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        
        this.setScale(2);
        scene.physics.world.enableBody(this);
        this.setImmovable(true);

        this.playable = playable;
        this.orientation = 0;
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
        this.name = name;
        this.textname = scene.add.text(this.x - this.width /2 , this.y + this.height, this.name, 
        { font: '16px Courier', fill: '#FFFFFF', backgroundColor:"#000000", align:'center'}
        );

        this.textname.setPosition(this.x - this.textname.width /2 , this.y + this.height+5)

        this.textname.setDepth(20)
        
        //set smaller hitbox
        this.setSize(30, 52).setOffset(17, 12);
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
            //this.stop(null, true);
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

    }

    context(scene){
        //this.play("stretchD",true)
        this.setAnimation()
        this.update();
        this.textname.setPosition(this.x - this.textname.width/2, this.y + this.height + 5)
        if (this.playable){
            this.controlPlayer(scene);
        }
    }



}