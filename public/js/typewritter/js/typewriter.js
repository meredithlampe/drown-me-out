class TypeWriter {
    constructor(config = null) {
        this.count = 0;
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
        if (!config.style) {
            config.style = {
                'color': 'white',
                'fontSize': '36px',
                'wordWrap':{'width':this.scene.sys.game.config.width}
            }
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
        this.count++;
        var myText = this.text.substr(0, this.count);
        //console.log(myText);
        this.text1.setText(myText + "|");
        //
        //
        if (this.count == this.text.length) {
            this.timer1.remove(false);
            this.text1.setText(myText);
        }
    }
}