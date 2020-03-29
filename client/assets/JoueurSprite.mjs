export class JoueurSprite extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        
        this.setScale(2);
        scene.physics.world.enableBody(this);
        this.setImmovable(true);
        this.hp = 10;
        scene.anims.create({
            key: "stretch",
            frameRate: 10,
            frames: scene.anims.generateFrameNumbers("armel", {
                start: 0,
                end: 6
            })
        });

        //set smaller hitbox
        this.setSize(30, 52).setOffset(17, 12);
        this.setCollideWorldBounds(true);
    }
    context(scene){
        this.play("stretch",true)
        this.update();
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



}