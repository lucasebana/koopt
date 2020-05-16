export class Object extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,texture,id,frame = 0){
        super(scene,x,y,texture,frame)
        this.id = id
        this.displayOriginX = 0
        this.displayOriginY = 0
    }
}