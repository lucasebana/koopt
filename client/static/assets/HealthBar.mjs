export class HealthBar {

    constructor (scene, x, y, pdv)
    {
        //this.bar = new Phaser.GameObjects.Graphics(scene);

        this.rectangle = new Phaser.GameObjects.Rectangle(scene,x,y,200,50);

        this.x = x;
        this.y = y;
        this.value = pdv;
        this.value_init=pdv
        this.p = 76 / 100;

        //this.draw();

        //scene.add.existing(this.bar);
        scene.add.existing(this.rectangle)
    }

    delta (amount)//peut être positif ou négatif
    {
        this.value += amount;

        if (this.value < 0)
        {
            this.value = 0;
        }
        if (this.value > this.value_init)
        {
            this.value = this.value_init;
        }

        //this.draw();

        return (this.value === 0);
    }

    draw ()
    {
        

        if (this.value < 30)
        {
            this.rectangle.setFillStyle(0xff0000);
            //this.bar.fillStyle(0xff0000);
        }
        else
        {
            this.rectangle.setFillStyle(0x00ff00);
            //this.bar.fillStyle(0x00ff00);
        }

        var d = Math.floor(this.p * this.value);

        //this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
        
        this.rectangle.setPosition(this.x + 2, this.y + 2)
        this.rectangle.setSize(d,12)
    }

}

