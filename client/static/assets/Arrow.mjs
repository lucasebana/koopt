export class Arrow extends Phaser.Physics.Arcade.Sprite{
    constructor (scene,x,y,frame)
    {
        super(scene, x, y, 'arrows', frame);

        this.visible = false;
    }
}
