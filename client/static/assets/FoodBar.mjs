export class FoodBar {
    
    constructor ( scene, varx , vary , pdf ) {

        this.x = varx;
        this.y = vary;
        this.rectangle = new Phaser.GameObjects.Rectangle(scene,this.x,this.y,800,50);
        this.value=pdf
        this.p=(76 * 5) / (100*5);
        this.draw()
        scene.add.existing(this.rectangle)
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
        this.rectangle.setFillStyle(0xff7f00)
        var d = Math.floor(this.p * this.value);
        this.rectangle.setPosition(this.x+10, this.y+10)
        this.rectangle.setSize(d,12)    
    }
    
}