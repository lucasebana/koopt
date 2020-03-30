var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

//config.height = document.getElementById("b").clientHeight;//ou offsetHeight ? 
//config.width = document.getElementById("b").clientWidth;//ou offsetHeight ? 

/*
window.onresize(()=>{
    
})
*/

var controls;
var game = new Phaser.Game(config);
//game.renderer.renderSession.roundPixels = true
function preload ()
{
    /*
    this.load.setBaseURL('http://labs.phaser.io');

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
    */
   this.load.image('pkm', 'static/assets//tilesetpkmn2xT.png');
   this.load.tilemapTiledJSON('map', 'static/assets/map2.json');
}

function create ()
{   

    var map = this.make.tilemap({ key: 'map' });

    //var map = this.make.tilemap({ key: 'map' });
    
    // The first parameter is the name of the tileset in Tiled and the second parameter is the key
    // of the tileset image used when loading the file in preload.
    //var tiles = map.addTilesetImage('pkmn.tsx', 'tiles');

    // You can load a layer from the map using the layer name from Tiled, or by using the layer
    // index (0 in this case).

    var tiles = map.addTilesetImage('pkm', 'pkm');
    var layer = map.createStaticLayer(0, tiles, 0, 0);
    var layer2 = map.createStaticLayer(1, tiles, 0, 0);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    var cursors = this.input.keyboard.createCursorKeys();
    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
    };
    controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

    /*
    var help = this.add.text(16, 16, 'Arrow keys to scroll', {
        fontSize: '18px',
        padding: { x: 10, y: 5 },
        backgroundColor: '#000000',
        fill: '#ffffff'
    });
    help.setScrollFactor(0);

    /*
    this.add.image(400, 300, 'sky');

    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    var logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
    */
}

function update (time, delta)
{
    controls.update(delta);
}   