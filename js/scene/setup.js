class Setup extends Phaser.Scene
{

    constructor ()
    {
        super('setup');
    }

    preload ()
    {
      this.load.spritesheet("plot", "assets/spritesheets/plot.png", {
        frameWidth: options.plotSize,
        frameHeight: options.plotSize,
      });
      this.load.spritesheet("cards", "assets/spritesheets/cards.png", {
        frameWidth: options.cardWidth,
        frameHeight: options.cardHeight,
      });
    }

    create ()
    {
      this.input.mouse.disableContextMenu();
      this.cameras.main.fadeIn(1000, 0, 0, 0);
      myPlayer.setExplore();
      new SetupGrid(this,
        true,
        myPlayer,{
          x:0,
          y:0},
          {
            "x":2,
            "y":2,
            "type":0
        }, (pointer) => {
          if (pointer.rightButtonDown())
          {
             
          }
          else
          {
              
          }
      })  
    }
}