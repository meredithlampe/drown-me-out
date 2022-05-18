let game;

const TEXT_STYLE = {
    'color': 'black ',
    'fontSize': '32px',
    'wordWrap': {
        'width': 600
    }
};

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

function createBackground(scene) {
    scene.cbpkFar = scene.add.tileSprite(0, 0, game.config.width, game.config.height, 'cbpk_far');
    scene.cbpkFar.setOrigin(0, 0);
    scene.cbpkFar.setScrollFactor(0);
}

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
        createBackground(this);
        this.map = this.make.tilemap({key: 'map'});
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.counter = 0;
    }
    
    update() {
        this.counter++;

        if (this.counter === 100) {
            this.showNewSingleText();
        }

        if (this.counter === 200) {
            this.showItRocksText();
        }

        if (this.counter === 300) {
            this.showText("pre-save via link in bio", 660);
        }

        if (this.counter === 400) {
            this.showSmallText("(seriously)", 860);
        }
    }

    showNewSingleText() {
        var myText = 
            "New single drops August 20"
        this.tw = new TypeWriter({
            'scene': this,
            'text': myText,
            'speed': .2,
            'style': TEXT_STYLE,
            'x': 100,
            'y': 260
        });
    }

    showItRocksText() {
        var myText = 
            "(it rocks)"
        this.tw = new TypeWriter({
            'scene': this,
            'text': myText,
            'speed': .2,
            'style': {
                'color': 'black ',
                'fontSize': '18px',
                'wordWrap': {
                    'width': 600
                }
            },
            'x': 100,
            'y': 460
        });   
    }

    showText(text, y) {
        this.tw = new TypeWriter({
            'scene': this,
            'text': text,
            'speed': .2,
            'style': TEXT_STYLE,
            'x': 100,
            'y': y
        });  
    }

    showSmallText(text, y) {
        this.tw = new TypeWriter({
            'scene': this,
            'text': text,
            'speed': .2,
            'style': {
                'color': 'black ',
                'fontSize': '18px',
                'wordWrap': {
                    'width': 600
                }
            },
            'x': 100,
            'y': y
        });   
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

