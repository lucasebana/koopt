import { FoodBar } from './FoodBar.mjs'
import {WoodLevel} from './WoodLevel.mjs'
import { game_handler } from '../game_handler.mjs'
import { GameScene } from './GameScene.mjs'
export class InterfaceScene extends Phaser.Scene{
    constructor(){
        super({
            key:"INTERFACE"
        })
    }

init(data){
    console.log(data)
    console.log("intialiation de interface")

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

/*Gestion du temps*/
    const d= new Date()
    this.timestamp_start=game.scene.getScene("GAME").timestamp_ini
    this.temps_partie=15
    
    this.temps=d.getTime()/1000-this.timestamp_start;
    var min= this.temps_partie-Math.floor(this.temps/60);
    var sec= 60-(this.temps % 60);
    this.textname = this.add.text(this.foodbar.x+750,this.foodbar.y+10,"Temps restant:  "+min+":"+ parseInt(sec), 
    { font: '16px Courier', fill: '#FFFFFF', backgroundColor:"#000000", align:'center'}
    );
    this.textname.setPosition(this.foodbar.x +750 , this.foodbar.y+10)
    this.textname.setDepth(20)

}

update(){
    this.woodlevel.update();
    this.updateText();
    
    
}
updateText(){
    const d= new Date()
    this.temps=d.getTime()/1000-this.timestamp_start;
    var min= this.temps_partie-(Math.floor(this.temps/60));
    var sec= 60-(this.temps % 60);
    this.textname.text="Temps restant:  "+min+":"+parseInt(sec);
}

}

