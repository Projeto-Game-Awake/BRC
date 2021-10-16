class Game extends Phaser.Scene
{
    constructor ()
    {
        super('game');
    }

    preload ()
    {
        this.load.json("start", "scenario/start.json");
    }

    create ()
    {
        let style = {
            fontSize: 96,
            fontFamily: 'Arial',
            align: "center",
            color:'#d75413',
            wordWrap: { width: 800, useAdvancedWrap: true }
        }
        let text = "Buscando o\nResgate\nCernil";
        this.message = this.add.text(400,300,text,style);
        this.message.setOrigin(0.5);

        style = {
            fontSize: 60,
            fontFamily: 'Arial',
            align: "center",
            color:'#ffffff',
            wordWrap: { width: 800, useAdvancedWrap: true }
        }
        let touch = this.add.text(400,550,"Toque na tela",style);
        touch.setOrigin(0.5);

        
        this.input.on('pointerdown', function (pointer) {
            let scenario = this.cache.json.get("start");
            if(scenario) {
                let dm = this.plugins.install('myPluginRef1', DialogMessagePlugin, true);
                dm.show(this, scenario, () => {               
                    this.scene.start('selectPhase');
                });
            } else {         
                this.scene.start('selectPhase');
            }
        },this);

    }
}

const config = {
    type: Phaser.CANVAS,
    backgroundColor: '#125555',
    scale: {
        //autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    dom: {
        createContainer: true
    },
    canvas: document.getElementById("canvasGame"),
    scene: [Game, SelectPhase, SelectFeelingPhase, Setup, Explore, Battle]
};

const options = {
    feelingSize: 48,
    plotSize: 64,
    cardWidth: 60,
    cardHeight: 124,
    marginY : (600 - 64 * 5)  / 2
}

let game = new Phaser.Game(config);
let myPlayer = new Player(null);
let tutorial = 0;