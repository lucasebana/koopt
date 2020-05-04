export class Food extends Phaser.Physics.Arcade.Sprite{
    constructor (scene,x,y,texture,frame=15)
    {
        super(scene, x, y, texture, frame);
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        
        this.setScale(0.75);
        scene.physics.world.enableBody(this);
        //this.visible=true;

    }


}