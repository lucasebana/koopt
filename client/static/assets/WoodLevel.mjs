export class WoodLevel extends Phaser.Physics.Arcade.Sprite{

    constructor(scene,varx,vary,texture,number) {

        super(scene,varx,vary,texture)

        
        this.value=number
        this.place=scene

        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);
        
        this.setScale(0.5);

        this.x = varx
        this.y = vary
        this.draw()


    }
    addWood(amount){
        this.value+=amount
        this.draw();
    }


    draw(){
        
        this.textname = this.place.add.text(this.x+10,this.y+20, this.value, 
            { font: '16px Courier', fill: '#FFFFFF', backgroundColor:"#000000", align:'center'}
            );
            this.textname.setPosition(this.x +10 , this.y+20)
            this.textname.setDepth(20)
        }
    

}