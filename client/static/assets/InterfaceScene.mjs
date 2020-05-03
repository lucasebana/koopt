import { FoodBar } from './FoodBar.mjs'
import {WoodLevel} from './WoodLevel.mjs'
export class InterfaceScene extends Phaser.Scene{
    constructor(){
        super({
            key:"INTERFACE"
        })
    }

init(data){
    console.log(data)
    console.log("intialiation de interface")
    this.numero=null;
}

preload(){
    this.load.image('wood', 'static/assets/Wood.png');
    
}

create(){

window.interface=this

/* Food Bar */
this.foodbar=new FoodBar(this,5,5,100*5);




/*Wood Level*/
this.woodlevel=new WoodLevel(this,35,70,'wood',40)


}

update(){
    this.woodlevel.update();
}
}
