import {JoueurSprite} from '/static/assets/JoueurSprite.mjs'
export class Food extends Phaser.Physics.Arcade.Sprite{
    constructor (scene,x,y,texture,frame=0)
    {
        super(scene, x, y, texture, frame);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        
        this.setScale(0.60);
        scene.physics.world.enableBody(this);
        //this.visible=true;
        scene.anims.create({
            key: "eat",
            frameRate: 2,
            frames: scene.anims.generateFrameNumbers("food",{
                start: 0,
                end: 4
            }),
            repeat: 0

            })
    }

    context(scene){
        
    this.eating=game.scene.getScene("GAME").manger
    console.log(this.eating)

    if (this.eating===true){
        this.visible=true
        this.play("eat",false);            
        this.eating=false;
    }
}
   
}