let game;

const TEXT_STYLE = {
    'color': 'black ',
    'fontSize': '32px',
    'wordWrap': {
        'width': 600
    }
};

const PLAYER_START_X = 100; // actual start
const PLAYER_START_Y = 100;

window.onload = function() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    // Our game scene
    var gameScene = new PlayGame();
    var preloadScene = new PreloadScene();

    var config = {
        type: Phaser.AUTO,
        backgroundColor:0x1a213e,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
            parent: "thegame",
            width:750,
            height: 1200,
        },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false    
            }
        },
        debug: true
    };
    game = new Phaser.Game(config);
    
    // load scenes
    game.scene.add('preloadScene', preloadScene);
    game.scene.add("game", gameScene);
    window.focus();
    
    // start title
    game.scene.start('preloadScene');
}

function createBackground(scene) {
    scene.cbpkFar = scene.add.tileSprite(
        0, 
        0, 
        game.config.width, 
        game.config.height,
        'cbpk_far',
    );
    scene.cbpkFar.setOrigin(0, 0);
    scene.cbpkFar.setScrollFactor(0);
}   

// function createBackground(scene) {
//     scene.cbpkFar = scene.add.tileSprite(0, 0, game.config.width, game.config.height, 'cbpk_far');
//     scene.cbpkFar.setOrigin(0, 0);
//     scene.cbpkFar.setScrollFactor(0);
//     scene.cbpkMid = scene.add.tileSprite(0, 0, game.config.width, game.config.height, 'cbpk_mid');
//     scene.cbpkMid.setOrigin(0, 0);
//     scene.cbpkMid.setScrollFactor(0);
//     scene.cbpkClose = scene.add.tileSprite(0, 0, game.config.width, game.config.height, 'cbpk_close');
//     scene.cbpkClose.setOrigin(0, 0);
//     scene.cbpkClose.setScrollFactor(0); 

//     scene.whiteOverlay = scene.add.graphics(
//             { lineStyle: { width: 2, color: 0xaa0000 }, fillStyle: { color: 0xFFFFFF, alpha: 0.4    } }
//         );
//     var rect = new Phaser.Geom.Rectangle();
//     rect.width = 1200;
//     rect.height = 1600;
//     scene.whiteOverlay.fillRectShape(rect);
// }

// function updateAutoscrollBackground(scene) {
//     scene.cbpkFar.tilePositionX += .2;
//     scene.cbpkMid.tilePositionX += .4;
//     scene.cbpkClose.tilePositionX += .6;
// }

// function createLogos(scene) {
//     let colaturaLogo = scene.add.image(
//         80,
//         100,  
//         "colatura_logo"
//     );
//     colaturaLogo.setOrigin(0,0);
//     let idbhText = scene.add.image(
//         50, 
//         700,
//         "idbh_logo"
//     );
//     idbhText.setOrigin(0, 0);
// }

class PreloadScene extends Phaser.Scene {

    constructor() {
        super({key : 'preloadScene'});
    }

    preload() {

        var loadingText = this.add.text(250,260,"Loading...", { fontSize: '32px', fill: '#FFF' });
        this.load.spritesheet('jennica',
            'assets/neon_graphics/Sprite_Jennica.png',
            { frameWidth: 72, frameHeight: 72 }
        );
        this.load.spritesheet('meredith',
            'assets/neon_graphics/Sprite_Meredith.png',
            { frameWidth: 72, frameHeight: 72 }
        );

        // load audio
        this.load.audio('idbh', 'audio/full/idbh_med.mp3');
        this.load.on('complete', this.complete, this);

        // load font
          this.load.bitmapFont(
            'carrier_command', 
            'assets/fonts/carrier_command.png', 
            'assets/fonts/carrier_command.xml'
        );

        this.load.image("cbpk_far", "assets/neon_graphics/tan.png");
        this.load.tilemapTiledJSON('map', 'assets/map/level1.5.json'); 
    }

    complete() {
        this.scene.start("game");
    }

}

class PlayGame extends Phaser.Scene {

    constructor() {
        super({key: 'game'});
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        createBackground(this);
        this.player = this.createPlayer('jennica', 100);
        this.meredith = this.createPlayer('meredith', 300);
        this.map = this.make.tilemap({key: 'map'});
        this.cameras.main.setBounds(200, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.groundTiles = this.map.addTilesetImage('CityEscapeColatura_Tileset5', 'tiles', 72, 72, 0);
        this.createGround();

        this.physics.world.bounds.width = this.groundLayer.width;
        this.physics.world.bounds.height = this.groundLayer.height;

        this.counter = 0;
    }
    
    update() {
        this.counter++;

        if (this.counter === 200) {
            this.showNewSingleText("'I Don\'t Belong Here' comes out Aug 20!", 600);
        }
        if (this.counter === 400) {
            this.showNewSingleText('Pre-save via link in bio.', 800);
        }

        // update character movement
        if (this.isUserPressingLeft())
        {
            this.player.setVelocityX(-400);
            this.player.anims.play('jennica_left', true);

            this.meredith.setVelocityX(-400);
            this.meredith.anims.play('meredith_left', true);
        }
        else if (this.isUserPressingRight())
        {
            this.player.setVelocityX(400);
            this.player.anims.play('jennica_right', true);

            this.meredith.setVelocityX(500);
            this.meredith.anims.play('meredith_right', true);
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.anims.play('jennica_turn');
            this.meredith.setVelocityX(0);
            this.meredith.anims.play('meredith_turn');
        }

        if (this.isUserPressingUp()) {
            if (this.player.body.onFloor()) {
                this.player.setVelocityY(-530);
            }
        }
    }

    showNewSingleText(text, y) {
        this.tw = new TypeWriter({
            'scene': this,
            'text': text,
            'speed': .2,
            'style': TEXT_STYLE,
            'x': 300,
            'y': y
        });
    }

    isUserPressingLeft() {
        return this.cursors.left.isDown || this.leftButtonClicked;
    }

    isUserPressingRight() {
        return this.cursors.right.isDown || this.rightButtonClicked;
    }

    isUserPressingUp() {
        return this.cursors.up.isDown || this.upButtonClicked;
    }


    createGround() {
        // create the ground layer
        // this.groundLayer = this.map.createDynamicLayer('World', this.groundTiles, 0, game.config.height - this.map.heightInPixels);
        this.groundLayer = this.map.createDynamicLayer(
            'Ground n Platforms', 
            this.groundTiles, 
            0, 
            game.config.height - this.map.heightInPixels,
        );
        // the player will collide with this layer
        this.groundLayer.setCollisionByExclusion([-1]);
    }

    createPlayer(name, x) {
        // create player
        let player = this.physics.add.sprite(x, PLAYER_START_Y, name);
        this.setPlayerAnims(player, name);
        return player;
    }

    setPlayerAnims(player, playerName) {
        player.displayWidth = 140;
        player.displayHeight = 140;
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.body.setGravityY(300)
        this.anims.create({
            key: playerName + '_left',
            frames: this.anims.generateFrameNumbers(playerName, { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: playerName + '_turn',
            frames: [ { key: playerName, frame: 8 } ],
            frameRate: 20
        });
        this.anims.create({
            key: playerName + '_right',
            frames: this.anims.generateFrameNumbers(playerName, { start: 9, end: 16 }),
            frameRate: 10,
            repeat: -1
        });
    }

    setPlayerColliders(player) {
        // player collides with ground
        this.physics.add.collider(player, this.groundLayer);
    }

};


class TypeWriter {
    constructor(config = null) {
        this.count = 0;
        this.foundPeriod = false;
        this.periodPauseCount = 10;
        // this.callback = config.callback;

        if (!config) {
            console.error("no TypeWritter config");
            return;
        }
        if (!config.scene) {
            console.error("no TypeWritter scene");
            return;
        }
        this.scene = config.scene;
        //
        //
        if (!config.text) {
            console.log("text missing");
            return;
        }
        this.text = config.text;
        //
        //
        if (config.speed) {
            this.speed = config.speed;  
        } else {
            this.speed = 5;
        }
        if (!config.x) {
            config.x = 0;
        }
        if (!config.y) {
            config.y = 0;
        }
        //
        //
        this.text1 = this.scene.add.text(config.x, config.y, " ", config.style)
        var secs = this.speed * 250;
       

        this.timer1 = this.scene.time.addEvent({
            delay: secs,
            callback: this.tick,
            callbackScope: this,
            loop: true
        });
    }
    tick() {
        if (this.foundPeriod) {
            if (this.periodPauseCount > 0) {
                this.periodPauseCount--;
            } else {
                this.foundPeriod = false;
                this.periodPauseCount = 10;
            }
        } else {
            this.count++;
            var myText = this.text.substr(0, this.count);
            this.text1.setText(myText + "|");
            if (myText.charAt(this.count - 1) === '.'){
                this.foundPeriod = true;
                this.periodPauseCount = 10;
            }
            if (this.count == this.text.length) {
                this.timer1.remove(false);
                this.text1.setText(myText);
                // this.callback();
            }
        }
    }
}

