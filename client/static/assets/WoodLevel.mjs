export class WoodLevel extends Phaser.Physics.Arcade.Sprite{

    constructor(scene,x,y,texture,number) {

        super(scene,x,y,texture)

        //this.level = new Phaser.GameObjects.Text(scene);
        this.value=number
        

        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        
        this.setScale(2);
        scene.physics.world.enableBody(this);
        this.setImmovable(true);
        //this.draw()
        //scene.add.existing(this.level);


    }

    /*draw{
        this.level.filltext(this.value,this.x+5,this.y);
    }*/

}