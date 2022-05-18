let game;
    const PLAYER_START_X = 100; // actual start
    const PLAYER_START_Y = 100;

window.onload = function() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    // Our game scene
    var gameScene = new PlayGame();
    var preloadScene = new PreloadScene();
    // var menuScene = new MenuScene();
    // var highScoreScene = new HighScoreScene();
    // var introCutScene = new IntroCutScene();

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
    // game.scene.add('menu', menuScene);
    // game.scene.add('highScoreScene', highScoreScene);
    game.scene.add("game", gameScene);
    // game.scene.add("intro_cut", introCutScene);
    window.focus();
    
    // start title
    game.scene.start('preloadScene');
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
        this.load.image("cbpk_mid", "assets/neon_graphics/bg_mid_gray.png");
        this.load.image("cbpk_close", "assets/neon_graphics/bg_close.png");
        this.load.image("idbh_text", "assets/idbh_text.jpeg");
        this.load.image("colatura_blue", "assets/blue colatura.png");
        this.load.tilemapTiledJSON('map', 'assets/map/level1.5.json'); 
    }

    complete() {
        this.scene.start("game");
    }

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

    // colatura
    scene.idbh = scene.add.image(800, 340, 'colatura_blue');
    scene.idbh.setOrigin(0, 0);
    scene.idbh.displayWidth *= .5;
    scene.idbh.displayHeight *= .5;
    scene.idbh.setScrollFactor(.2);

    // i don't belong here
    let text = scene.add.bitmapText(
        800, 
        570,
        'carrier_command',
        'I Don\'t Belong Here',
        42
    );
    text.setTint(0x424242, 0x424242, 0x424242, 0x424242);
    text.setScrollFactor(.2);

    // city background
    scene.cbpkMid = scene.add.tileSprite(0, 0, game.config.width, game.config.height, 'cbpk_mid');
    scene.cbpkMid.setOrigin(0, 0);
    scene.cbpkMid.setScrollFactor(0);

    // city foreground
    scene.cbpkClose = scene.add.tileSprite(0, 0, game.config.width, game.config.height, 'cbpk_close');
    scene.cbpkClose.setOrigin(0, 0);
    scene.cbpkClose.setScrollFactor(0); 
}

class PlayGame extends Phaser.Scene {

    constructor() {
        super({key: 'game'});
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        createBackground(this);
        this.createPlayer();
        this.map = this.make.tilemap({key: 'map'});
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        this.groundTiles = this.map.addTilesetImage('CityEscapeColatura_Tileset5', 'tiles', 72, 72, 0);
        this.createGround();

        this.physics.world.bounds.width = this.groundLayer.width;
        this.physics.world.bounds.height = this.groundLayer.height;

        this.counter = 0;
    }
    
    update() {
        this.counter++;

        // update character movement
        if (this.isUserPressingLeft())
        {
            this.player.setVelocityX(-860);
            this.player.anims.play('jennica_left', true);
        }
        else if (this.isUserPressingRight())
        {
            this.player.setVelocityX(860);
            this.player.anims.play('jennica_right', true);
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.anims.play('jennica_turn');
        }

        if (this.isUserPressingUp()) {
            if (this.player.body.onFloor()) {
                this.player.setVelocityY(-530);
            }
        }

        // update background
        this.cbpkFar.tilePositionX = this.cameras.main.scrollX * .1;
        this.cbpkMid.tilePositionX = this.cameras.main.scrollX * .3;
        this.cbpkClose.tilePositionX = this.cameras.main.scrollX * .4;
        // this.whiteOverlay.x = this.cameras.main.scrollX;
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

    createPlayer() {
        // create player
        this.player = this.physics.add.sprite(PLAYER_START_X, PLAYER_START_Y, 'jennica');
        this.setPlayerAnims(this.player, 'jennica');
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

