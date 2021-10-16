class SelectFeelingPhase extends Phaser.Scene
{
    constructor ()
    {
        super('selectFeelingPhase');
    }

    init(data) {
        this.type = data.type;
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
            frameWidth: options.plotSize,
            frameHeight: options.plotSize,
          });
        this.load.spritesheet("feeling2","assets/spritesheets/2/feeling.png",{
            frameWidth: options.plotSize*2,
            frameHeight: options.plotSize*2,
          });
        this.load.spritesheet("feeling4","assets/spritesheets/4/feeling.png",{
            frameWidth: options.plotSize*4,
            frameHeight: options.plotSize*4,
          });
        this.load.spritesheet("estrelas","assets/spritesheets/estrelas.png",{
            frameWidth: 20,
            frameHeight: 20,
          });
    }

    create ()
    {
        let self = this;
        let enemy = new EnemyPlayer(this);
        let feeling = new Stage(self,enemy,100,300,this.type,3,0,1,0,"orgulho1");
        feeling = new Stage(self,enemy,300,300,this.type,0,0,1,0,"orgulho2");
        feeling = new Stage(self,enemy,600,300,this.type,0,0,1,0,"orgulho3");
    }
}