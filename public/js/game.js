let game;
// const PLAYER_START_X = 8000; // finish
const PLAYER_START_X = 200; // actual start
const PLAYER_START_Y = 600;
const HOUSE_X = 8200;
const OTHER_PLAYER_START_X = 8500;
const OTHER_PLAYER_START_Y = 800;
const DARYL_START_X = 8300;
const DARYL_START_Y = 100;
const RAT_START_X = {
    RAT_0: 3000,
    RAT_1: 6400,
    RAT_2: 6700
};

const COLOR_PRIMARY = 0x262626e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

let database;

const TEXT_STYLE = {
    'color': 'black',
    'fontSize': '32px',
    'wordWrap': {
        'width': 600
    }
};

const CLOTHING = {
    SOCK: 'sock',
    SHIRT: 'sihrt',
    PANTS: 'pants',
    MORE_PANTS: 'morePants',
    UNDERWEAR: 'underwear'
};

window.onload = function() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    // Our game scene
    var gameScene = new PlayGame();
    var preloadScene = new PreloadScene();
    var menuScene = new MenuScene();
    var highScoreScene = new HighScoreScene();
    var introCutScene = new IntroCutScene();

    var config = {
        type: Phaser.AUTO,
        backgroundColor:0x1a213e,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
            parent: "thegame",
            width:2300,
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
    game.scene.add('menu', menuScene);
    game.scene.add('highScoreScene', highScoreScene);
    game.scene.add("game", gameScene);
    game.scene.add("intro_cut", introCutScene);
    window.focus();
    
    // start title
    game.scene.start('preloadScene');
}

function createBackground(scene) {
    createTanBackground(scene);
    scene.cbpkMid = scene.add.tileSprite(0, 0, game.config.width, game.config.height, 'cbpk_mid');
    scene.cbpkMid.setOrigin(0, 0);
    scene.cbpkMid.setScrollFactor(0);
    scene.cbpkClose = scene.add.tileSprite(0, 0, game.config.width, game.config.height, 'cbpk_close');
    scene.cbpkClose.setOrigin(0, 0);
    scene.cbpkClose.setScrollFactor(0); 
}

function createTanBackground(scene) {
    scene.cbpkFar = scene.add.tileSprite(0, 0, game.config.width, game.config.height, 'cbpk_far');
    scene.cbpkFar.setOrigin(0, 0);
    scene.cbpkFar.setScrollFactor(0);
}

function updateAutoscrollBackground(scene) {
    scene.cbpkFar.tilePositionX += .2;
    scene.cbpkMid.tilePositionX += .4;
    scene.cbpkClose.tilePositionX += .6;
}

function createLogos(scene) {
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
}

function createGround(scene) {
    // create the ground layer
    // scene.groundLayer = scene.map.createDynamicLayer(
    //     'Ground n Platforms', 
    //     scene.groundTiles, 
    //     0, 
    //     game.config.height - scene.map.heightInPixels
    // );
    // // the player will collide with this layer
    scene.groundLayer = scene.add.tileSprite(0,1500,230000,1000,'ground');
    // scene.groundLayer.setCollisionByExclusion([-1]);
}

function setDinoAnims(scene, player, playerName) {
        player.displayWidth = 140;
        player.displayHeight = 140;
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.body.setGravityY(300);
        scene.anims.create({
            key: playerName + '_right',
            frames: scene.anims.generateFrameNumbers(playerName, { start: 0, end: 7 }),
            frameRate: 5,
            repeat: -1
        });
    }

function setPlayerAnims(scene, player, playerName) {
        player.displayWidth = 140;
        player.displayHeight = 140;
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.body.setGravityY(300);
        scene.anims.create({
            key: playerName + '_left',
            frames: scene.anims.generateFrameNumbers(playerName, { start: 1, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: playerName + '_turn',
            frames: [ { key: playerName, frame: 9 } ],
            frameRate: 20
        });
        scene.anims.create({
            key: playerName + '_turn_left',
            frames: [ { key: playerName, frame: 0 } ],
            frameRate: 20
        });
        scene.anims.create({
            key: playerName + '_right',
            frames: scene.anims.generateFrameNumbers(playerName, { start: 10, end: 17 }),
            frameRate: 10,
            repeat: -1
        });
    }

function isInView(scene, player) {
    let worldView = scene.cameras.main.worldView;
    return player.x > worldView.x && player.x < (worldView.x + worldView.width);
}

class PreloadScene extends Phaser.Scene {

    constructor() {
        super({key : 'preloadScene'});
    }

    preload() {

        // set loading screen
        this.load.image("cbpk_far", "assets/neon_graphics/tan.png");
        this.cameras.main.setBackgroundColor("#edf0df");
        var loadingText = this.add.text(250,260,"Loading...", { fontSize: '32px', fill: '#212121' });

        // load all the other stuff
        this.load.image("the_game_text", "assets/the-game.png");
        this.load.image("back_text", "assets/back.png");
        
        this.load.image("cbpk_mid", "assets/neon_graphics/bg_mid.png");
        this.load.image("cbpk_close", "assets/neon_graphics/bg_close.png");
        this.load.image("heart_full", "assets/pixel_heart_full.png");
        this.load.image("heart_empty", "assets/pixel_heart_empty.png");

        this.load.spritesheet('dino', 
            'assets/dino\ run\ 2.png',
            { frameWidth: 375, frameHeight: 300  }
        );

        this.load.spritesheet('meredith', 
            'assets/neon_graphics/Sprite_Meredith_2.png',
            { frameWidth: 72, frameHeight: 72  }
        );
        this.load.spritesheet('jennica',
            'assets/neon_graphics/Sprite_Jennica_2.png',
            { frameWidth: 72, frameHeight: 72 }
        );
        this.load.spritesheet('daryl', 
            'assets/neon_graphics/Sprite_Daryl_2.png',
            { frameWidth: 72, frameHeight: 72  }
        );
        this.load.spritesheet('digo', 
            'assets/neon_graphics/Sprite_Digo_2.png',
            { frameWidth: 72, frameHeight: 72  }
        );
        this.load.spritesheet('rat', 
            'assets/rat_sprites.png',
            { frameWidth:32, frameHeight: 32  }
        );
        this.load.spritesheet('rat_right', 
            'assets/rat_sprites_right.png',
            { frameWidth:32, frameHeight: 32  }
        );


        // we have to load the spike separately to display 'objects' correctly
        // this.load.image('spike', 'assets/stackabuse_tiler_assets/images/spike.png');
        this.load.image(CLOTHING.SOCK, 'assets/neon_graphics/sock.png');
        this.load.image(CLOTHING.SHIRT, 'assets/neon_graphics/shirt.png');
        this.load.image(CLOTHING.PANTS, 'assets/neon_graphics/pants.png');
        this.load.image(CLOTHING.MORE_PANTS, 'assets/neon_graphics/morePants.png');
        this.load.image(CLOTHING.UNDERWEAR, 'assets/neon_graphics/underwear.png');
        this.load.image('rat_still', 'assets/rat_still.png');
        // this.load.image('button_gold', 'assets/stackabuse_tiler_assets/images/button_gold.png');
        // this.load.image('tiles', 'assets/stackabuse_tiler_assets/tilesets/platformPack_tilesheet.png');
        this.load.image('tiles', 'assets/neon_graphics/tiles_mono.png');
        this.load.tilemapTiledJSON('map', 'assets/map/level1.15.json'); 

        // load arrow left/right buttons
        // this.load.image('left_arrow', 'assets/neon_graphics/arrows/Arrow_Left.png');
        // this.load.image('left_arrow_press', 'assets/neon_graphics/arrows/Arrow_LeftPress.png');
        // this.load.image('right_arrow', 'assets/neon_graphics/arrows/Arrow_Right.png');
        // this.load.image('right_arrow_press', 'assets/neon_graphics/arrows/Arrow_RightPress.png');
        // this.load.image('up_arrow', 'assets/neon_graphics/arrows/Arrow_Up.png');
        // this.load.image('up_arrow_press', 'assets/neon_graphics/arrows/Arrow_UpPress.png');

        // load menu buttons
        this.load.image('start_button', 'assets/start.png');
        this.load.image('high_scores_button', 'assets/high-scores.png');

        // load sound icon
        this.load.image('sound_on', 'assets/sound/icons8-sound-32.png');
        this.load.image('sound_off', 'assets/sound/icons8-mute2-32.png');

        // load audio
        this.load.audio('idbh', 'audio/full/I Don\'t Belong Here (mp3 master).mp3');
        this.load.audio('idbh_remix', 'audio/full/IDBH Remix Master Final.mp3');

        this.load.on('complete', this.complete, this);

        // load font
          this.load.bitmapFont(
            'carrier_command', 
            'assets/fonts/carrier_command.png', 
            'assets/fonts/carrier_command.xml'
        );
        // load cursor
        this.load.image('block', 'assets/block.png');

        // load dialog stuff
        this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
    }

    complete() {
        this.scene.start('menu');
    }

}

class MenuScene extends Phaser.Scene {
    constructor() {
        super({key: 'menu'});
    }

    preload() { 
        createTanBackground(this);
    }

    create() {
        createBackground(this);
        createLogos(this);
        this.createStartButton();
        this.createHighScoresButton();
        this.skipIntro = this.scene.settings.data.skipIntro;
    }

    createStartButton() {
        let buttonY = game.config.height * .78;
        let startButton = this.add.image(game.config.width * .35, buttonY, "start_button");
        startButton.scale = .7
        startButton.setOrigin(0, 0);
        startButton.setInteractive();
        startButton.on('pointerdown', () => {
                this.scene.start("intro_cut");    
        });
    }

    createHighScoresButton() {
        let button = this.add.image(
            160, 
            1030, 
            "high_scores_button",
        );
        button.scale = .7;
        button.setOrigin(0, 0);
        button.setInteractive();
        button.on('pointerdown', () => {
            this.scene.start("highScoreScene");
        });
    }

    update() {
        updateAutoscrollBackground(this);
    }

    createLogos(scene) {
        // let colaturaLogo = scene.add.image(
        //     80,
        //     70,      
        //     "colatura_logo"
        // );
        // colaturaLogo.setOrigin(0,0);
        // colaturaLogo.setScale(0.7);
        // let idbhText = scene.add.image(
        //     50, 
        //     700,
        //     "idbh_logo"
        // );
        // idbhText.setOrigin(0, 0);
    }
}

class HighScoreScene extends Phaser.Scene {
    vert() { return 400; }
    horizontal() { return 50; }
    constructor() {
        super({key: 'highScoreScene'});
    }

    preload() {
        createTanBackground(this);
    }

    create() {    
        this.scores = [];
        this.highScoreInView = 1;
        this.lowScoreInView = 7;
        this.scoresText = [];
        this.scrollPause = 100;
        createBackground(this);
        this.createIBDHLogo();
        this.createTheGameText();
        this.createBackButton();
        this.createHighScoresText();
        this.populateHighScores();
        this.skipIntro = this.scene.settings.data.skipIntro;
    }

    createIBDHLogo() {
        let idbhText = this.add.image(
            this.horizontal(), 
            300, 
            "idbh_logo"
        );
        idbhText.setOrigin(0, 0);
    }

    createTheGameText() {
        let theGameText = this.add.image(
            this.horizontal() + 220, 
            470, 
            "the_game_text"
        );
        theGameText.setOrigin(0, 0);
        theGameText.scale = .5;
    }

    createBackButton() {
        let backText = this.add.image(
            40, 
            40, 
            "back_text"
        );
        backText.setOrigin(0, 0);
        backText.scale = .5;
        backText.setInteractive();
        backText.on('pointerdown', () => {
            this.scene.start("menu", {'skipIntro': this.skipIntro});
        });
    }

    createHighScoresText() {
        let button = this.add.image(
            this.horizontal() + 110, 
            this.vert() + 200, 
            "high_scores_button",
        );
        button.scale = .7;
        button.setOrigin(0, 0);
    }

    populateHighScores() {
    }

    update() {
        if (this.scrollPause > 0) {
            this.scrollPause--;
            return;
        }
        updateAutoscrollBackground(this);
        this.updateScrollingScores();
    }

    updateScrollingScores() {
        for (let ii = this.highScoreInView; ii <= this.lowScoreInView; ii++) {
            let scoreText = this.scoresText[ii];
            scoreText.y -= .4;
            if (scoreText.y < this.vert() + 330) {
                scoreText.destroy();
                if (this.lowScoreInView + 1 < this.scores.length) {
                    let newScoreIndex = this.lowScoreInView + 1;
                    this.scoresText[newScoreIndex] = this.add.bitmapText(
                        220, 
                        1150,
                        'carrier_command',
                        newScoreIndex + ' ' + this.scores[newScoreIndex]['name'] + ' ' + this.scores[newScoreIndex]['score'],
                        28
                    );
                    this.lowScoreInView++;
                }
                this.highScoreInView++;
            }
        }
    }
}

class IntroCutScene extends Phaser.Scene {

    preload() {
        createTanBackground(this);
        this.load.scenePlugin('rexuiplugin', 'lib/rexuiplugin.min.js', 'rexUI', 'rexUI');
    }

    constructor() {
        super({key: 'intro_cut'});
        this.introCutScenePhase;
    }

    create() {
        this.map = this.make.tilemap({key: 'map'});
        createBackground(this);

        // tiles for the ground layer, lava, etc.
        this.groundTiles = this.map.addTilesetImage('mono', 'tiles', 72, 72, 0);
        createGround(this);

        // set the boundaries of our game world
        this.physics.world.bounds.width = this.groundLayer.width;
        this.physics.world.bounds.height = this.groundLayer.height;

        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.createBandmates();

        // set up meredith
        this.meredith = this.physics.add.sprite(-100, 800, 'dino');
        this.physics.add.collider(this.meredith, this.groundLayer);
        setDinoAnims(this, this.meredith, 'dino');
        this.scene.start("game", {'player': 'dino'});
    }

    update() {
        switch(this.introCutScenePhase) {
            case introCutScenePhases.BAND_RUN_IN:
                if (this.digo.x > 400) {
                    return;
                }
                this.cameras.main.startFollow(this.digo);
                this.cameras.main.zoomTo(2, 2000, 'Linear', false, (cam, prog) => {
                    if (prog === 1) {
                        this.introCutScenePhase = introCutScenePhases.MER_RUN_IN;
                    }
                });
                this.introCutScenePhase = introCutScenePhases.BAND_RUN_IN_ZOOM;
            case introCutScenePhases.BAND_RUN_IN_ZOOM:
                if (this.digo.x > 200) {
                    return;
                }
                this.stopPlayer(this.digo, 'digo');
                this.stopPlayer(this.daryl, 'daryl');
                this.stopPlayer(this.jennica, 'jennica');
                break;                
            case introCutScenePhases.MER_RUN_IN:
                this.meredith.anims.play('meredith_turn');
                this.introCutScenePhase = introCutScenePhases.DIGO_HEY;
                this.createSkipButton();
                break;
            case introCutScenePhases.DIGO_HEY:
                 let textBox = Dialog2.createTextBox(this, {}, () => {
                     textBox.pageEndCallback = () => {
                         textBox.pageEndCallback = () => {
                             textBox.pageEndCallback = () => {
                                 textBox.pageEndCallback = () => {
                                     textBox.pageEndCallback = () => {
                                         textBox.destroy();
                                        this.introCutScenePhase = introCutScenePhases.PICK_YOUR_PLAYER;
                                     };
                                     textBox.start('MEREDITH: Okay awesome!');
                                }   
                                 textBox.start('DARYL: And I\'ll find a way to break into his house!');
                             }
                             textBox.start('JENNICA: And I’ll meet you at your ex\'s and help you grab your stuff!');
                         }
                         textBox.start('DIGO: Well I can go get the van and grab all of our equipment.');
                     }
                     textBox.start('MEREDITH:  eek! oh no I hadn’t heard. I don’t have any of my clothes with me, they\'re all over the city...and most of them are at my ex\'s house!', 50);                        
                 });
                 textBox.start('DIGO: Hey Meredith there was a big disaster and we need to get off Manhattan before they shut down the bridges!', 50);
                this.introCutScenePhase = introCutScenePhases.DIGO_HEY_PAUSE;
                break;
            case introCutScenePhases.DIGO_HEY_PAUSE:
                // this.introCutScenePhase = introCutScenePhases.PICK_YOUR_PLAYER;
                break;
            case introCutScenePhases.PICK_YOUR_PLAYER:
                this.createPickYourPlayerBackground();
                this.createPickYourPlayerText();
                this.createPlayerButtons();
                this.introCutScenePhase = introCutScenePhases.PICK_YOUR_PLAYER_PAUSE;
                break;
            case introCutScenePhases.PICK_YOUR_PLAYER_PAUSE:
                break;
            case introCutScenePhases.END:
                this.scene.start('game');
                break;
        }
    }

    createPlayerButtons() {
        let worldView = this.cameras.main.worldView;

        let meredithX = worldView.x + worldView.width * .3;
        let meredithY = worldView.y + worldView.height * .6;
        let meredithButton = this.add.sprite(meredithX, meredithY, 'meredith');
        meredithButton.anims.play('meredith_right');
        meredithButton.scale = 1.5;
        let meredithText = this.add.bitmapText(meredithX - 40, meredithY + 70, 'carrier_command', 'meredith', 10);
        
        // click button or text to start game
        meredithButton.setInteractive();
        meredithButton.on('pointerup', () => {
            this.scene.start('game', {'player': 'meredith'});
        }, this);
        meredithText.setInteractive();
        meredithText.on('pointerup', () => {
            this.scene.start('game', {'player': 'meredith'});
        }, this);

        let jennicaX = worldView.x + worldView.width * .7;
        let jennicaY = worldView.y + worldView.height * .6;
        let jennicaButton = this.add.sprite(
            jennicaX, 
            jennicaY, 
            'jennica'
        );
        jennicaButton.scale = 1.5;
        jennicaButton.anims.play('jennica_right');
        let jennicaText = this.add.bitmapText(jennicaX - 30, jennicaY + 70, 'carrier_command', 'jennica', 10);

        // click button or text to start game
        jennicaButton.setInteractive();
        jennicaButton.on('pointerup', () => {
            this.scene.start('game', {'player': 'jennica'});
        }, this);
        jennicaText.setInteractive();
        jennicaText.on('pointerup', () => {
            this.scene.start('game', {'player': 'jennica'});
        }, this);
    }

    createPickYourPlayerText () {
        let worldView = this.cameras.main.worldView;
        let textX = worldView.x + worldView.width * .15;
        let textY = worldView.y + worldView.height * .3;
        this.pickYourPlayerText = this.add.bitmapText(textX, textY, 'carrier_command', 'pick your player', 15);
    }

    createPickYourPlayerBackground() {
        this.pickYourPlayerBackground = this.add.graphics(
            { lineStyle: { width: 2, color: 0xaa0000 }, fillStyle: { color: 0x000000, alpha: 0.8 } }
        );
        var rect = new Phaser.Geom.Rectangle();
        rect.width = 800;
        rect.height = 1600;
        rect.alpha = 0;
        this.pickYourPlayerBackground.fillRectShape(rect);
         this.tweens.add({
            targets: rect,
            alpha: 0.5,
            duration: 2000,
            delay: 2000,
        }); 
    }

    createBandmates() {
        this.digo = this.physics.add.sprite(900, 800, 'digo');
        this.setUpBandmate(this.digo, 'digo');
        this.daryl = this.physics.add.sprite(1125, 800, 'daryl');
        this.setUpBandmate(this.daryl, 'daryl');
        this.jennica = this.physics.add.sprite(1025, 800, 'jennica');
        this.setUpBandmate(this.jennica, 'jennica');
    }

    stopPlayer(player, playerName) {
        player.setVelocityX(0);
        player.anims.play(playerName + '_turn_left', true);
    }

    setUpBandmate(player, playerName) {
        this.physics.add.collider(player, this.groundLayer);
        player.setScale(3);
        setPlayerAnims(this, player, playerName);
        player.setVelocityX(-120);
        player.anims.play(playerName + '_left', true);
    }


    createGoButton() {
        this.goButtonText = this.add.bitmapText(130, 805, 'carrier_command', 'go');
        this.goButtonText.alpha = 0;
        this.goButtonText.setScale(1.5);
        this.goButton = this.add.image(100, 780, 'block').setOrigin(0);
        this.goButton.alpha = 0;
        this.goButton.displayWidth = 160;
        this.goButton.displayHeight = 100;
        this.goButton.setInteractive();
        this.goButton.on('pointerdown', () => {
            this.scene.start('game');   
        }, this);
    }

    createSkipButton() {
        let worldView = this.cameras.main.worldView;
        let textX = worldView.x + worldView.width * .85;
        let textY = worldView.y + worldView.height * .05;
        this.skipText = this.add.text(textX, textY, "skip", {
            'color': 'black',
            'fontSize': '10px',
            'wordWrap': {
                'width': 600
        }});
        this.skipText.alpha = 0;
        this.skipText.setInteractive();
        this.skipText.on('pointerdown', () => {
            this.scene.start('game', {'player': 'meredith'});   
        }, this);
        this.tweens.add({
            targets: this.skipText,
            alpha: "+=.5",
            duration: 2000,
            delay: 2000,
        }); 
    }
}

class PlayGame extends Phaser.Scene {

    constPlayerSeesExHouse() {
        return HOUSE_X - 300;
    }

    constructor() {
        super({key: 'game'});
    }

    preload() {
        this.load.scenePlugin('rexuiplugin', 'lib/rexuiplugin.min.js', 'rexUI', 'rexUI');
    }

    create() {
        this.playerCanMove = true;
        this.hasPlayedExCutScene = false;
        this.isPlayingExCutScene = false;
        this.exCutScenePhase = null;
        this.bossSceneItems = [];
        this.playerName = this.scene.settings.data.player;
        this.hp = 3;
        this.otherPlayerName = this.playerName === 'jennica' ? 'meredith' : 'jennica';
        this.map = this.make.tilemap({key: 'map'});
        createBackground(this);
        // this.createLogos(this);
        // tiles for the ground layer, lava, etc.
        this.groundTiles = this.map.addTilesetImage('mono', 'tiles', 72, 72, 0);
        createGround(this);
        this.createHouse();
     
        // set the boundaries of our game world
        this.physics.world.bounds.width = this.groundLayer.width;
        this.physics.world.bounds.height = this.groundLayer.height;

        this.createPlayer();
        this.createAnchoredUIElements();

        // create cursors for player movement
        this.cursors = this.input.keyboard.createCursorKeys();
        this.setPlayerColliders(this.player);

        this.physics.add.collider(this.player, this.otherPlayer);

        // set bounds so the camera won't go outside the game world
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // make the camera follow the player
        this.cameras.main.startFollow(this.player);

        this.score = 0;

        this.soundOn = true;
        this.music = this.sound.add(this.playerName === 'meredith' ? 'idbh' : 'idbh_remix', { loop: true });
        this.music.play();

        // high score dialog stuff
        this.blackOverlay;
        this.initials;
        this.initialCursor;
        this.initialIndex;
        this.initialText;
        this.gameOverText;
        this.yourScoreText;
        this.highScoreCharButtons;
        this.gameOver = false;
    }

    createHouse() {
        this.houseLayer = this.map.createDynamicLayer(
            'Ex House', 
            this.groundTiles, 
            0, 
            game.config.height - this.map.heightInPixels
        );
    }

    createLogos() {
        // let colaturaLogo = this.add.image(
        //     140,
        //     200,  
        //     "colatura_logo"
        // );
        // colaturaLogo.setOrigin(0,0);
        // colaturaLogo.setScale(.7);
        // let idbhText = this.add.image(
        //     800, 
        //     400,
        //     "idbh_logo"
        // );
        // idbhText.setOrigin(0, 0);
    }

    win(player, finish) {
        player.setVelocity(0, 0);
        let tw = this.tweens.add({
            targets: player,
            alpha: 1,
            duration: 1000,
            ease: 'Linear',
            repeat: 100,
        });
        this.playerHit();
    }

    gameOverHandler() {
        this.gameOver = true;
        this.playerCanMove = false;
        this.player.setVelocity(0, 0);
        this.player.play('idle', true);
        this.showRecordScoreDialog();                    
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showRecordScoreDialog() {
        let dialogX = this.cameras.main.worldView.x;
        //create background
        this.addBlackOverlay(dialogX, 0.9);

        // create game over text
        this.gameOverText = this.add.bitmapText(dialogX + 140, 200, 'carrier_command', 'game over'); 
        this.yourScoreText = this.add.bitmapText(dialogX + 140, 400, 'carrier_command', 'your score: ' + this.score);
        this.yourInitialsText = this.add.bitmapText(dialogX + 140, 500, 'carrier_command', 'your initials: ');

        // create high score input
        let highScoreChars = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ,
            'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T' ,
            'U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '<',
        ];
        this.highScoreCharButtons = [];
        highScoreChars.map((letter, index) => {
            let xPosition = dialogX + 100 + ((index % 10) * 60);
            let yPosition = 750 + (Math.floor(index / 10) * 80);
            let text = this.add.bitmapText(xPosition, yPosition, 'carrier_command', letter);    
            text.setInteractive();
            text.on('pointerup', () => {
                this.recordScoreClickLetter(letter);
            }, this);
            this.highScoreCharButtons[index] = text;
        });
        
        this.initials = 'AAA';
        this.initialIndex = 0;
        this.initialText = this.add.bitmapText(dialogX + 300, 600, 'carrier_command', this.initials);     
        this.initialText.setLetterSpacing(20);
        this.initialText.setScale(1.5);

        // add cursor
        this.initialCursor = this.add.image(this.initialText.x - 17, this.initialText.y - 10, 'block').setOrigin(0);
        this.initialCursor.setScale(1.7);
        this.tweens.add({
            targets: this.initialCursor,
            alpha: 0.2,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            duration: 350
        });

        // add done button
        this.saveScoreDone = this.add.bitmapText(dialogX + 300, 1060, 'carrier_command', 'done');
        this.saveScoreDoneButton = this.add.image(dialogX + 250, 1040, 'block').setOrigin(0);
        this.saveScoreDoneButton.displayWidth = 250;
        this.saveScoreDoneButton.displayHeight = 80;
        this.saveScoreDoneButton.setInteractive();
        this.saveScoreDoneButton.on('pointerdown', () => {
            this.saveHighScore(this.initials, this.score, function() {
                this.scene.start('highScoreScene', {'skipIntro': true});
                this.closeRecordScoreDialog();  
                this.music.stop();
                this.sound.remove('idbh');                
            }.bind(this));
        }, this);
    }

     addBlackOverlay(x) {
        this.blackOverlay = this.add.graphics(
            { lineStyle: { width: 2, color: 0xaa0000 }, fillStyle: { color: 0x000000, alpha: 0.8 } }
        );
        var rect = new Phaser.Geom.Rectangle();
        rect.width = 800;
        rect.height = 1600;
        rect.alpha = 0;
        rect.x = x;
        this.blackOverlay.fillRectShape(rect);
         this.tweens.add({
            targets: rect,
            alpha: 0.5,
            duration: 4000,
            delay: 2000,
        }); 
     }

    closeRecordScoreDialog() {
        this.blackOverlay.destroy();
        this.gameOverText.destroy();
        this.yourScoreText.destroy();
        this.yourInitialsText.destroy();
        this.initialText.destroy();
        this.initialCursor.destroy();
        this.saveScoreDone.destroy();
        this.saveScoreDoneButton.destroy();
        this.highScoreCharButtons.map(button => button.destroy());
    }

    saveHighScore(initials, score, callback) {
    }

    updateCursor() {
        this.initialCursor.x = this.initialText.x + (88 * this.initialIndex) - 17;
    }

    recordScoreClickLetter(letter) {
        if (letter === '<') {
            if (this.initialIndex > 0) {
                this.initialIndex--;
                this.updateCursor();
            }
        } else {
            this.initials = this.initials.substring(0, this.initialIndex) + letter + this.initials.substring(this.initialIndex + 1);
            if (this.initialIndex < 2) {
                this.initialIndex++;
            }
            this.initialText.setText(this.initials);
            this.updateCursor();            
        }
    }

    createSocks() {
        this.socks = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        const clothesObjects = this.map.getObjectLayer('Socks')['objects'];
        clothesObjects.forEach(thing => {
            const sock = this.socks.create(thing.x, thing.y + 40, CLOTHING.SOCK).setOrigin(0, 0);
            sock.body.setSize(sock.width, sock.height).setOffset(20, 20);
        });
    }

    createShirts() {
        this.shirts = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        const clothesObjects = this.map.getObjectLayer('Shirts')['objects'];
        clothesObjects.forEach(thing => {
            const shirt = this.shirts.create(thing.x, thing.y + 40, CLOTHING.SHIRT).setOrigin(0, 0);
            shirt.body.setSize(shirt.width, shirt.height).setOffset(20, 20);
        });
    }

    createPants() {
        this.pants = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        const clothesObjects = this.map.getObjectLayer('Pants')['objects'];
        clothesObjects.forEach(thing => {
            const pants = this.pants.create(thing.x, thing.y + 40, CLOTHING.PANTS).setOrigin(0, 0);
            pants.body.setSize(pants.width, pants.height).setOffset(20, 20);
        });
    }

    createMorePants() {
        this.morePants = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        const clothesObjects = this.map.getObjectLayer('Pants 2')['objects'];
        clothesObjects.forEach(thing => {
            const pants = this.morePants.create(thing.x, thing.y + 40, CLOTHING.MORE_PANTS).setOrigin(0, 0);
            pants.body.setSize(pants.width, pants.height).setOffset(20, 20);
        });   
    }

    setRatAnims(rat) {
        rat.displayWidth = 140;
        rat.displayHeight = 140;
        rat.setCollideWorldBounds(true);
        rat.body.setGravityY(300);
        this.anims.create({
            key: 'rat_left',
            frames: this.anims.generateFrameNumbers('rat', { start: 30, end: 39 }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'rat_turn',
            frames: [ { key: 'rat', frame: 40 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'rat_right',
            frames: this.anims.generateFrameNumbers('rat_right', { start: 0, end: 9 }),
            frameRate: 20,
            repeat: -1
        });

    }

    createFinish() {
        this.finish = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        const finishObject = this.map.getObjectLayer('Underwear')['objects'];

        // there should be only 1 finish object but loop through anyway
        finishObject.forEach(finishObject => {
            const finish = this.finish.create(finishObject.x, finishObject.y + 40 - finishObject.height, 'underwear').setOrigin(0, 0);
            finish.body.setSize(finish.width - 20, finish.height - 20).setOffset(20, 20);
        })
    }

    update() {
        this.updateCharacterMovement(); 
        this.updateBackground();
    }

    playExCutScene() {
        if (!this.exCutScenePhase) {
            this.exCutScenePhase = exCutScenePhases.FLASH;
        }
        switch (this.exCutScenePhase) {
            case exCutScenePhases.FLASH:

                this.player.setVelocityX(0);
                this.player.anims.play(this.playerName + '_turn');
                 this.cameras.main.flash(2000, 0, 0, 0, false, (cam, prog) => {
                    if (prog === 1) { // flash is finished
                       this.exCutScenePhase = exCutScenePhases.WALK;
                    }
                });
                break;
            case exCutScenePhases.WALK:
                if (this.player.x < HOUSE_X - 250) {
                    this.player.setVelocityX(80);
                    this.player.anims.play(this.playerName + '_right', true);
                } else {
                    this.exCutScenePhase = exCutScenePhases.DARYL_WALK;
                }
                break;
            case exCutScenePhases.DARYL_WALK:
                if (this.daryl.x > 8250) {
                    this.daryl.setVelocityX(-90);
                    this.daryl.anims.play('daryl_left', true);
                } else {
                    this.daryl.setVelocityX(0);
                    this.daryl.anims.play('daryl_turn_left');
                    this.exCutScenePhase = exCutScenePhases.DIALOG;
                }
                break;
            case exCutScenePhases.DIALOG:
                this.player.setVelocityX(0);
                this.player.anims.play(this.playerName + '_turn');
                let textBox = Dialog2.createTextBox(this, {}, () => {
                    textBox.pageEndCallback = () => {
                        textBox.pageEndCallback = () => {
                            textBox.pageEndCallback = () => {
                                this.exCutScenePhase = exCutScenePhases.OTHER_PLAYER_WALK;
                                textBox.destroy();
                            }
                            textBox.start('DARYL: Ok but there are some rats in here too so watch out!');
                        }
                        textBox.start(this.playerName.toUpperCase() + ': Ok throw all of the stuff down to me!');
                    }
                    textBox.start('DARYL:  Yeah! It was easy, the door was unlocked.', 50);                        
                }, 100);
                textBox.start(this.playerName.toUpperCase() + ': Hey Daryl! You broke in?!', 50);
                this.exCutScenePhase = exCutScenePhases.DIALOG_PAUSE;
                break;
            case exCutScenePhases.DIALOG_PAUSE:
                break;
            case exCutScenePhases.OTHER_PLAYER_WALK:
                if (this.otherPlayer.x > 8250) {
                    this.otherPlayer.setVelocityX(-180);
                    this.otherPlayer.anims.play(this.otherPlayerName + '_left', true);
                } else {
                    this.exCutScenePhase = exCutScenePhases.OTHER_PLAYER_DIALOG;
                    this.otherPlayer.setVelocityX(0);
                    this.otherPlayer.anims.play(this.otherPlayerName + '_turn_left', true);
                }
                break;
            case exCutScenePhases.OTHER_PLAYER_DIALOG:
                this.otherPlayerTextBox = Dialog2.createTextBox(this, {}, () => {
                    if (this.exCutScenePhase = exCutScenePhases.OTHER_PLAYER_DIALOG) {
                        this.exCutScenePhase = exCutScenePhases.COUNTDOWN_START;
                        this.otherPlayerTextBox.destroy();                        
                    }
                }, 100);
                let otherPlayerDialogName = this.otherPlayerName === 'jennica' ? 'JENNICA' : 'MEREDITH';
                this.otherPlayerTextBox.start(otherPlayerDialogName + ': I\'ll help you catch stuff!!', 50);                
                this.exCutScenePhase = exCutScenePhases.DIALOG_PAUSE;
                break;
            case exCutScenePhases.COUNTDOWN_START:
            if (this.otherPlayerTextBox) {
                this.otherPlayerTextBox.destroy();
            }
                this.addBlackOverlay(this.cameras.main.worldView.x, 0.6);
                this.exCutScenePhase = exCutScenePhases.COUNTDOWN_EXPLANATION;
                break;
            case exCutScenePhases.COUNTDOWN_PAUSE:
                this.countdownDelay--;
                if (this.countdownDelay === 0) {
                    this.countdownValue--;
                    if (this.countdownValue === 0) {
                        this.blackOverlay.destroy();
                        this.countdownText.destroy();
                        this.exCutScenePhase = exCutScenePhases.END;
                    } else {
                        this.exCutScenePhase = exCutScenePhases.COUNTDOWN_SHOW_NUMBER;    
                    }
                }
                break;
            case exCutScenePhases.COUNTDOWN_EXPLANATION:
                this.countdownText = this.add.text(
                    this.cameras.main.worldView.x + 200,
                    460,
                    'FINAL BOSS\n\nCollect as many items of clothing as possible, avoid the rats at all costs.', 
                    { 
                        fontSize: '34px', 
                        fill: '#FFF', 
                        'wordWrap': {
                            'width': 400
                        }
                    }
                );
                this.countdownValue = 4;
                this.countdownDelay = 300;
                this.exCutScenePhase = exCutScenePhases.COUNTDOWN_PAUSE;
                break;
            case exCutScenePhases.COUNTDOWN_SHOW_NUMBER:
                if (this.countdownText) {
                    this.countdownText.destroy();
                }
                this.countdownText = this.add.text(
                    this.cameras.main.worldView.x + 350,
                    560,
                    this.countdownValue + "", 
                    { 
                        fontSize: '64px', 
                        fill: '#FFF', 
                        alpha: 0.1 
                    }
                );
                this.exCutScenePhase = exCutScenePhases.COUNTDOWN_PAUSE;
                this.countdownDelay = 100;
                break;
            case exCutScenePhases.END:
                if (this.blackOverlay) {
                    this.blackOverlay.destroy();                    
                }
                if (this.countdownText) {
                    this.countdownText.destroy();                    
                }
                this.hasPlayedExCutScene = true;
                this.isPlayingExCutScene = false;
                this.fallingClothesTimer = 0;
                this.cameras.main.stopFollow();

                // start final boss game
                this.otherPlayerMoving = 'LEFT';
                this.finalBossSceneCounter = 0;
                this.finalBossSceneModRate = 50;
                break;
        }
    }

    playFinalBossScene() {

        // other player running back and forth
        if (this.otherPlayerMoving === 'RIGHT') {
            if (this.otherPlayer.x < 8350) {
                this.otherPlayer.setVelocityX(120);
                this.otherPlayer.anims.play(this.otherPlayerName + '_right', true);
            } else {
                this.otherPlayerMoving = 'LEFT';
            }
        } else if (this.otherPlayerMoving === 'LEFT') {
            if (this.otherPlayer.x > (7900)) {
                this.otherPlayer.setVelocityX(-120);
                this.otherPlayer.anims.play(this.otherPlayerName + '_left', true);
            } else {
                this.otherPlayerMoving = 'RIGHT';
            }
        }

        this.fallingClothesTimer++;
        if (this.fallingClothesTimer % this.finalBossSceneModRate === 0) {
            if (this.fallingClothesTimer % 200 === 0 && this.finalBossSceneModRate > 10) {
                this.finalBossSceneModRate -= 10;
            }
            let randomIndex = Math.floor(Math.random() * 6);
            let itemType = this.getAllThrowableItemsAsArray()[randomIndex];
            var item = this.physics.add.sprite(
                this.daryl.x,
                this.daryl.y,
                itemType
            );
            this.bossSceneItems[this.bossSceneItems.length] = item;
            let randomAngle = (Math.random() * 3) + 118;
            item.enableBody(true, this.daryl.x, this.daryl.y, true, true);
            this.physics.velocityFromRotation(
                randomAngle,
                -300,
                item.body.velocity,
            );
            if (itemType === 'rat_still') {
                item.displayWidth = 70;
                item.displayHeight = 55;
                item.body.setSize(8, 8, true).setOffset(2, 2);
                this.physics.add.overlap(this.player, item, this.playerHit, null, this);
            } else {
                this.physics.add.overlap(this.player, item, collectStar, null, this);
                this.physics.add.overlap(this.otherPlayer, item, collectStar, null, this);                
            }
        }
        for (let fallingItemIndex in this.bossSceneItems) {
            let fallingItem = this.bossSceneItems[fallingItemIndex];
            if (fallingItem && fallingItem.y > this.game.config.height) {
                fallingItem.destroy();
                this.bossSceneItems[fallingItemIndex] = null;
            }
            // if (fallingItem !== null && fallingItem !== undefined && fallingItem.body !== null && fallingItem.body !== undefined) {
            //     this.drawItemBoundingBox(fallingItem);
            // }
        }

    }

    drawItemBoundingBox(item) {
        if (item.boundingBox) {
            item.boundingBox.destroy();
        }
        let boundingBox = this.add.graphics(
                { lineStyle: { width: 2, color: 0xaa0000 }, fillStyle: { color: 0xFFFFFF, alpha: 0.6 } }
            );
        var rect = new Phaser.Geom.Rectangle();
        rect.width = item.body.width;
        rect.height = item.body.height;
        rect.x = item.body.x;
        rect.y = item.body.y;
        boundingBox.fillRectShape(rect);
        item.boundingBox = boundingBox;
    }

    getAllThrowableItemsAsArray() {
        var all = [];
        for(var key in CLOTHING){
            all.push(CLOTHING[key]);
        }
        all.push('rat_still');
        return all;
    }

    updateCharacterMovement() {
        // update character movement
        if (this.playerCanMove && this.isUserPressingLeft())
        {
            this.player.anims.play(this.playerName + '_left', true);

            // don't let player run off the left side of the screen during final boss
            if (!this.isFinalBossScene || 
                (this.isFinalBossScene && this.player.x > this.cameras.main.worldView.x + 60)) {
                this.player.setVelocityX(-160);                
            } else {
                this.player.setVelocityX(0);
            }
        }
        else if (this.playerCanMove && this.isUserPressingRight())
        {
            this.player.setVelocityX(160);
            this.player.anims.play(this.playerName + '_right', true);
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.anims.play(this.playerName + '_turn');
        }

        if (this.playerCanMove && this.isUserPressingUp()) {
            if (this.player.body.onFloor()) {
                this.player.setVelocityY(-530);
            }
        } else {
        }

        if (this.player.y > this.game.config.height - 200) {
            this.gameOverHandler();
        }
    }

    updateBackground() {
        // update background
        this.cbpkFar.tilePositionX = this.cameras.main.scrollX * .1;
        this.cbpkMid.tilePositionX = this.cameras.main.scrollX * .2;
        this.cbpkClose.tilePositionX = this.cameras.main.scrollX * .4;
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

    shouldShowExCutScene() {
        return !this.hasPlayedExCutScene && this.player.x >= this.constPlayerSeesExHouse();
    }

    isFinalBossScene() {
        return this.hasPlayedExCutScene;
    }

    createAnchoredUIElements() {
         this.input.addPointer(4);
        // create scoring system
        // this.scoreText = this.add.text(32, 32, 'score: 0', { fontSize: '48px', fill: '#404040' }).setScrollFactor(0);
        // this.hpHearts = [
        //     this.add.image(57, 107, "heart_full").setScrollFactor(0).setScale(0.1),
        //     this.add.image(107, 107, "heart_full").setScrollFactor(0).setScale(0.1),
        //     this.add.image(157, 107, "heart_full").setScrollFactor(0).setScale(0.1),
        // ];

        // this.createArrowButtons();

        // this.createSoundControl();
    }


    createArrowButtons() {
        // create arrow buttons
        let buttonY = game.config.height - 150;
        this.leftArrow = this.add.image(24, buttonY, "left_arrow").setScrollFactor(0);
        this.rightArrow = this.add.image(168, buttonY, "right_arrow").setScrollFactor(0);
        this.leftArrow.setOrigin(0, 0);
        this.rightArrow.setOrigin(0, 0);
        this.leftArrow.displayWidth = 120;
        this.leftArrow.displayHeight = 120;
        this.rightArrow.displayWidth = 120;
        this.rightArrow.displayHeight = 120;
        this.upArrow = this.add.sprite(game.config.width - 144, buttonY, "up_arrow").setScrollFactor(0);
        this.upArrow.setOrigin(0, 0);
        this.upArrow.displayWidth = 120;
        this.upArrow.displayHeight = 120;
        this.leftArrow.setInteractive();
        this.leftArrow.on('pointerdown', () => {
            this.leftButtonClicked = true;
        });
        this.leftArrow.on('pointerup', () => {
            this.leftButtonClicked = false;
        });

        this.rightArrow.setInteractive();
        this.rightArrow.on('pointerdown', () => {
            this.rightButtonClicked = true;
        });
        this.rightArrow.on('pointerup', () => {
            this.rightButtonClicked = false;
        });

        this.upArrow.setInteractive();
        this.upArrow.on('pointerdown', () => {
            this.upButtonClicked = true;
        });
        this.   upArrow.on('pointerup', () => {
            this.upButtonClicked = false;
        });
    }

    createSoundControl() {
        this.soundButton = this.add.sprite(game.config.width - 114, 20, 'sound_on').setScrollFactor(0);
        this.soundButton.setOrigin(0, 0);
        this.soundButton.setTint('#404040');
        this.soundButton.displayWidth = 80;
        this.soundButton.displayHeight = 80;
        this.soundButton.setInteractive();
        this.soundButton.on('pointerdown', () => {
            if (this.soundOn) {
                this.soundOn = false;
                this.music.pause();
                this.soundButton.setTexture('sound_off');
            } else {
                this.soundOn = true;
                this.music.resume();
                this.soundButton.setTexture('sound_on');
            }
        });
    }

    createPlayer() {
        // create player
        this.player = this.physics.add.sprite(PLAYER_START_X, PLAYER_START_Y, this.playerName);
        this.player.body.setSize(this.player.width - 20, this.player.height, true);
        setPlayerAnims(this, this.player, this.playerName);
    }

    createOtherPlayers() {
        this.otherPlayer = this.physics.add.sprite(OTHER_PLAYER_START_X, OTHER_PLAYER_START_Y, this.otherPlayerName);
        setPlayerAnims(this, this.otherPlayer, this.otherPlayerName); 
        this.physics.add.collider(this.otherPlayer, this.groundLayer);
        this.daryl = this.physics.add.sprite(DARYL_START_X, DARYL_START_Y, 'daryl');
        setPlayerAnims(this, this.daryl, 'daryl');
        this.physics.add.collider(this.daryl, this.groundLayer);
    }

    setPlayerColliders(player) {
        this.physics.add.collider(player, this.groundLayer);
        this.physics.add.collider(player, this.spikes, this.playerHit, null, this);
        this.physics.add.collider(player, this.lavaLayer, this.playerHit, null, this);
        this.physics.add.overlap(player, this.socks, collectStar, null, this);
        this.physics.add.overlap(player, this.shirts, collectStar, null, this);
        this.physics.add.overlap(player, this.pants, collectStar, null, this);
        this.physics.add.overlap(player, this.morePants, collectStar, null, this);
        this.physics.add.overlap(player, this.finish, this.win, null, this);
    }
};

    function collectStar (player, star)
    {
        star.disableBody(true, true);
        this.score += 10;
        // this.scoreText.setText('score: ' + this.score);
    }

class TypeWriter {
    constructor(config = null) {
        this.count = 0;
        this.foundPeriod = false;
        this.periodPauseCount = 10;
        this.callback = config.callback;
        //
        //
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
                if (this.callback) {
                    this.callback();                    
                }   
            }
        }
    }
}

class Dialog2 {
    
    static createTextBox(scene, config, pageEndCallback, extraMarginTop = 0) {
        let GetValue = Phaser.Utils.Objects.GetValue;
        let dialogWidth = Dialog2.getDialogWidth(scene);
        let padding = dialogWidth > 300 ? 20 : 10;
        var textBox = scene.rexUI.add.textBox({
                x: Dialog2.getDialogLeft(scene),
                y: Dialog2.getDialogTop(scene) + extraMarginTop,

                background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY, 0.7)
                    .setStrokeStyle(2, COLOR_LIGHT),

                text: Dialog2.getBBcodeText(
                    scene, 
                    dialogWidth, 
                    0, 
                    0),

                action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),

                space: {
                    left: padding,
                    right: padding,
                    top: padding,
                    bottom: padding, 
                    text: padding,
                }
            })
            .setOrigin(0)
            .layout();
        textBox.pageEndCallback = pageEndCallback;
        textBox
            .setInteractive()
            .on('pointerdown', this.pointerDownHandler, textBox)
            .on('pageend', function () {
                var icon = this.getElement('action').setVisible(true);
                this.resetChildVisibleState(icon);
                icon.y -= 30;
                var tween = scene.tweens.add({
                    targets: icon,
                    y: '+=30', // '+=100'
                    ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 500,
                    repeat: 0, // -1: infinity
                    yoyo: false
                });
            }, textBox);
        this.textBox = textBox;
        return textBox;
    }

    static pointerDownHandler() {
        var icon = this.getElement('action').setVisible(false);
        this.resetChildVisibleState(icon);
        if (this.isTyping) {
            this.stop(true);
        } else {
            if (this.isLastPage && this.pageEndCallback) {
                this.pageEndCallback();
            } else {
                this.typeNextPage();
            }

        }
    }

    static getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight) {
        return scene.add.text(0, 0, '', {
                fontSize: '20px',
                wordWrap: {
                    width: wrapWidth
                },
                maxLines: 3
            })
            .setFixedSize(fixedWidth, fixedHeight);
    }

    static getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight) {
        return scene.rexUI.add.BBCodeText(0, 0, '', {
            fixedWidth: fixedWidth,
            fixedHeight: fixedHeight,
            fontSize: wrapWidth < 300 ? '20px' : '30px',
            wrap: {
                mode: 'word',
                width: wrapWidth
            },
            maxLines: 4,
            color: '#000000'
        });
    }

    static getDialogLeft(scene) {
        let worldView = scene.cameras.main.worldView;
        return worldView.x + worldView.width * .05;
    }

    static getDialogTop(scene) {
        let worldView = scene.cameras.main.worldView;
        return worldView.y + worldView.width * .05;
    }
    static getDialogWidth(scene) {
        let worldView = scene.cameras.main.worldView;
        return worldView.width * .6;
    }
    static getDialogHeight(scene) {
        let worldView = scene.cameras.main.worldView;
        return worldView.height * .3;   
    }

    static destroy() {
        this.textBox.destroy();
    }

}

