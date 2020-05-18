export class FoodBar {
    
    constructor ( scene, varx , vary , pdf ) {

        //this.bar = new Phaser.GameObjects.Graphics(scene);
        this.x = varx;
        this.y = vary;
        this.rectangle = new Phaser.GameObjects.Rectangle(scene,this.x,this.y,800,50);
        this.value=pdf
        this.p=(76 * 5) / (100*5);
        this.draw()
        this.textname = scene.add.text(this.x+10,this.y+20, "Food", 
        { font: '16px Courier', fill: '#FFFFFF', backgroundColor:"#000000", align:'center'}
        );
        this.textname.setPosition(this.x +10 , this.y+20)
        this.textname.setDepth(20)
        scene.add.existing(this.rectangle)
        //scene.add.existing(this.bar);
    }

    delta (amount)//peut être positif ou négatif
    {
        this.value += amount;

        if (this.value < 0)
        {
            this.value = 0;
        }

        this.draw();

        return (this.value === 0);
    }

    draw()
    {   
        //Frame
        //this.bar.fillStyle(0x000000);
        //this.bar.fillRect(this.x, this.y, 384, 16);

        //Value
        //this.bar.fillStyle(0xffffff);
        //this.bar.fillRect(this.x + 2, this.y + 2, 76*5, 12);
        //this.bar.fillStyle(0xff7f00);
        this.rectangle.setFillStyle(0xff7f00)
        var d = Math.floor(this.p * this.value);
        this.rectangle.setPosition(this.x+10, this.y+10)
        this.rectangle.setSize(d,12)    
        //this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
    }
    
}