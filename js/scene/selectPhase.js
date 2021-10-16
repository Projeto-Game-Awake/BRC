class SelectPhase extends Phaser.Scene
{
    constructor ()
    {
        super('selectPhase');
    }

    init(data) {
        this.sceneName = data.sceneName;
    }

    preload ()
    {
        this.load.spritesheet("feeling", "assets/spritesheets/feeling.png", {
          frameWidth: options.feelingSize,
          frameHeight: options.feelingSize,
        });
        this.load.html('start', 'html/start.html');
        this.load.json("before_" + this.sceneName, "scenario/before_" + this.sceneName + ".json");
        this.load.json('feeling', "data/feeling.json");  
        this.load.spritesheet("feeling1","assets/spritesheets/1/feeling.png",{
            frameWidth: options.feelingSize,
            frameHeight: options.feelingSize,
        });
    }

    create ()
    {
        let type = 0;
        let self = this;
        let enemy = new EnemyPlayer(this);

        let startY = 100;
        let orgulho = new Feeling(self,enemy,400,startY,type++,0,0,1);
        orgulho.setClick(() => {
            this.scene.start("selectFeelingPhase",{type:orgulho.type});
        });
        
        let lines = [7,7,6];

        for(let i=0;i<3;i++) {
            let line = lines[i];
            let startX = 800 / line;
            startY += 100;
            for(let j=0;j<line;j++) {
                let feeling = new Feeling(self,enemy,50+startX*j,startY,type++,0,0);
                feeling.setClick(() => {
                    this.scene.start("selectFeelingPhase",{type:feeling.type});
                });
            }
        }
        startY += 100;

        let amor = new Feeling(self,enemy,400,startY,type,0,0);
        amor.setClick(() => {
            this.scene.start("selectFeelingPhase",{type:amor.type});
        });
           
    }
}