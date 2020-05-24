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
    //this.load.bitmapFont('myfont', 'static/assets/font/font.png', 'static/assets/font/font.fnt');
    
}

create(){

    window.interface=this

/* Food Bar */
    this.foodbar=new FoodBar(this,400,30,100*5);
    this.foodbar.rectangle.setDepth(20)
    this.last_food=100*5



/*Wood Level*/
    this.woodlevel=new WoodLevel(this,35,60,'wood',40)

/*Gestion du temps*/
    const d= new Date()
    this.timestamp_start=game.scene.getScene("GAME").timestamp_ini
    this.temps_partie=15
    
    this.temps=d.getTime()/1000-this.timestamp_start;
    var min= this.temps_partie-Math.floor(this.temps/60);
    var sec= 60-(this.temps % 60);
    this.textname = this.add.text(this.foodbar.x+750,this.foodbar.y+10,"Temps restant:  "+min+":"+ parseInt(sec),
    { font: '16px Courier', fill: '#FFFFFF', backgroundColor:"#000000", align:'center'});
    this.textname.setPosition(this.foodbar.x +675 , this.foodbar.y-10)
    this.textname.setDepth(20)


    this.textname2 = this.add.text(this.foodbar.x,this.foodbar.y+20, "Food",
    { font: '16px Courier', fill: '#FFFFFF', backgroundColor:"#000000", align:'center'}
);
    this.textname2.setPosition(this.foodbar.x -390 , this.foodbar.y-5)
    this.textname2.setDepth(20)

}

update(){
    
    this.updateWood();
    
    this.updateText();
    
    this.updateFood();

    this.updateEnd();
    
    
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
        this.foodbar.draw()
    }
}

updateWood(){
    this.bois=game.scene.getScene("GAME").wood
    this.woodlevel.value=this.bois
    this.woodlevel.draw()
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


updateEnd(){
    this.cas=game.scene.getScene("GAME").end
    console.log(this.cas)
    if (this.cas===0){//en cours
        return
    }
    if (this.cas===1){//défaite
        this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', { fontSize: '32px', fill: '#fff' });
    }
    if (this.cas==2){
        this.add.text(game.config.width / 2, game.config.height / 2, 'CONGRATULATIONS', { fontSize: '32px', fill: '#fff' });
    }
}
}
function onWoodCompleteHandler(tween,targets,sprite){
    sprite.setActive(false).setVisible(false)

}
