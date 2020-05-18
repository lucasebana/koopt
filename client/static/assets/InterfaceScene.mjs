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
    this.last_food=100*5



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
    
    this.updateFood();
    
    
}
updateText(){
    const d= new Date()
    this.temps=d.getTime()/1000-this.timestamp_start;
    var min= this.temps_partie-(Math.floor(this.temps/60));
    var sec= 60-(this.temps % 60);
    this.textname.text="Temps restant:  "+min+":"+parseInt(sec);
}

updateFood(){
    this.last_food=this.foodbar.value
    this.foodbar.value=game.scene.getScene("GAME").miam
    if (this.last_food!=this.foodbar.value){
    //this.foodbar.draw()
    }
}

woodAnimation(x,y){
    var spr = new Phaser.GameObjects.Sprite(this,x,y,"wood")
    spr.setScale(0.5)
    this.add.existing(spr)

    var tween = this.tweens.add({
        targets: spr,
        props: {
            x: { value: function () { return 35; }, ease: 'Power1' },
            y: { value: function () { return 70; }, ease: 'Power3' }
        },
        duration: 500,
        yoyo: false,
        repeat: 0,
        onComplete:onWoodCompleteHandler,
        onCompleteParams:[spr]
    });
}

}

function onWoodCompleteHandler(tween,targets,sprite){
    sprite.setActive(false).setVisible(false)
}

