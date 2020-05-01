import { FoodBar } from './FoodBar.mjs'

export class interface extends Phaser.Scene{
    constructor(){
        super({
            key:"INTERFACE"
        })
    }

init(data){
    console.log(data)
    this.numero=null;
    //this.updatedata();
}


create(){

window.interface=this

/* Food Bar */
this.foodbar=new FoodBar(this,5,5,100*5);
//this.foodbar.setScrollFactor(0);

this.textname = this.add.text(this.foodbar.bar.x+10,this.foodbar.bar.y+20, "Food", 
    { font: '16px Courier', fill: '#FFFFFF', backgroundColor:"#000000", align:'center'}
    );
this.textname.setPosition(this.foodbar.bar.x +10 , this.foodbar.bar.y+20)
this.textname.setDepth(20)

}

}
