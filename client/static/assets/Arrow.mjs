export class Arrow extends Phaser.Physics.Arcade.Sprite{
    constructor (scene,x,y,frame)
    {
        super(scene, x, y, 'fleche', frame);
        //scene.physics.world.enableBody(this);
        //this.visible = true;
    }
}
