class Plot extends Phaser.GameObjects.Container {
    
    constructor(scene, player, x, y, isCurrent, feeling) {
        let plot = scene.add.sprite(0,0,"plot");
        
        if(isCurrent && feeling != null) {
            feeling = new Feeling(scene,player,0,0,feeling.type,player.skipFeeling,1);
        } else {
            feeling = new Feeling(scene,player,0,0,1,player.skipFeeling,0);
            feeling.alpha = 0;
        }

        let items = [plot,feeling];
        items = items.concat(feeling.specials);
        super(scene, x, y, items);

        this.plot = plot;
        this.feeling = feeling;

        if(!isCurrent) {
            this.disable();
        }

        scene.add.existing(this);
    }
    setClick(callback) {
        this.plot.removeAllListeners();
        this.plot.setInteractive();
        this.plot.on("pointerdown", callback);
    }
    swap(plot) {
        let temp = this.feeling.frame.name;
        let alpha = this.feeling.alpha;
        this.feeling.setFrame(plot.feeling.frame.name);
        this.feeling.alpha = plot.feeling.alpha;
        plot.feeling.setFrame(temp.name);
        plot.feeling.alpha = alpha;
    }
    disable() {
        this.alpha = 0.2;
        if(this.unit != null) {
            this.unit.disable();
        }
    }
    enable() {
        this.plot.alpha = 1;
        if(this.feeling != null) {
            this.feeling.enable();
        }
    }
}