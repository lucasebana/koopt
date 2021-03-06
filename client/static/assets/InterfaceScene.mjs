import { FoodBar } from './FoodBar.mjs'
import {WoodLevel} from './WoodLevel.mjs'
import { HealthBar} from './HealthBar.mjs'
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
    this.foodbar=new FoodBar(this,400,60,100*5);
    this.foodbar.rectangle.setDepth(20)
    this.last_food=100*5



/*Wood Level*/
    this.woodlevel=new WoodLevel(this,35,90,'wood',0)

/*Gestion du temps*/
    const d= new Date()
    this.timestamp_start=game.scene.getScene("GAME").timestamp_ini
    this.temps_partie=15
    
    this.temps=d.getTime()/1000-this.timestamp_start;
    var min= this.temps_partie-Math.floor(this.temps/60);
    var sec= 60-(this.temps % 60);
    this.textname = this.add.text(this.foodbar.x+650,this.foodbar.y+10,"Temps restant:  "+min+":"+ parseInt(sec),
    { font: '16px Courier', fill: '#FFFFFF', backgroundColor:"#000000", align:'center'});
    this.textname.setPosition(this.foodbar.x +605 , this.foodbar.y-30)
    this.textname.setDepth(20)


    this.textname2 = this.add.text(this.foodbar.x,this.foodbar.y+20, "Food",
    { font: '16px Courier', fill: '#FFFFFF', backgroundColor:"#000000", align:'center'}
);
    this.textname2.setPosition(this.foodbar.x -390 , this.foodbar.y-5)
    this.textname2.setDepth(20)

    /*Health*/
    this.healthbar = new HealthBar(this,105,35,1000)
    this.textname3 = this.add.text(this.healthbar.x-100,this.healthbar.y-16, "Health",
    { font: '16px Courier', fill: '#FFFFFF', backgroundColor:"#000000", align:'center'}
);
    this.textname3.setDepth(20)
    this.healthbar.rectangle.setDepth(2)

    

}

update(){
    
    this.updateWood();
    
    this.updateText();
    
    this.updateFood();

    this.updateHealth();

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
    if (this.woodlevel.value != this.bois){
        this.woodlevel.value=this.bois
        this.woodlevel.draw()
    }
}
//petit problème d'affichage quand la valeur du bois est en dessous de 10

updateHealth(){
    this.j=game.scene.getScene("GAME").numero
    this.vie=game.scene.getScene("GAME").energies
    if (this.vie[this.j]!=this.healthbar.value){
        this.healthbar.value=this.vie[this.j]
        /*if (this.health ===0){
            this.player.alive=false
        }*/
        this.healthbar.draw();
        
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
            y: { value: function () { return 90; }, ease: 'Power3' }
        },
        duration: 500,
        yoyo: false,
        repeat: 0,
        onComplete:onWoodCompleteHandler,
        onCompleteParams:[spr]
    });

}

foodAnimation(x,y){
    var spr = new Phaser
}
updateEnd(){
    this.cas=game.scene.getScene("GAME").end
    if (this.cas===0){//en cours
        return
    }
    if (this.cas===1){//défaite
        this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', { fontSize: '32px', fill: '#fff' });
    }
    if (this.cas===2){
        this.add.text(game.config.width / 2, game.config.height / 2, 'CONGRATULATIONS', { fontSize: '32px', fill: '#fff' });
        }
    }

}

function onWoodCompleteHandler(tween,targets,sprite){
    sprite.setActive(false).setVisible(false)

}
