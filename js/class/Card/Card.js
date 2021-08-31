class Card {

    static Type = {
        DEFENCE:0,
        ATTACK:1,        
        MAGIC:2
    }

    static Color = [
      0x0000ff,
      0xff0000,        
      0xffff00
    ]

    static FeelingEvolution = [
      [0],
      [0,1],
      [0,2],
      [0,3],
      [0,4],
      [0,1,2],
      [0,1,3],
      [0,1,4],
      [0,2,3],
      [0,2,4],
      [0,3,4],
      [0,1,2,3],
      [0,1,2,4],
      [0,1,3,4],
      [0,2,3,4],
      [0,1,2,3,4],
    ]

    constructor(index) {
      this.index = index;
      this.self = false;
      this.spritesheet = "feeling";
    }

    draw(scene,player,x,y) {
      this.player = player;
      let back = scene.add.sprite(0,0,"cards", this.type);
      let sprite = scene.add.sprite(0,0,this.spritesheet, this.index);

      let container = scene.add.container(x,y,[back,sprite]);

      back.setInteractive();
      back.on(
          "pointerdown",
          () => {
            if(player.count == 3) {
              return;
            }
            let timeLine = scene.tweens.createTimeline();
            timeLine.add({
                targets: container,
                x: 600,
                y: 300,
                duration: 150,
                ease: "Linear",
                onComplete: () => {
                  player.popHand(this);
                  player.popDeck().draw(scene,player,x,y)
                  container.destroy();
                  if(player.count == 3) {
                    scene.doBattle();
                  }
                },
              });
            timeLine.play();
          },
          this
        );
        scene.add.existing(this);
    }
    isMatch(feeling) {
      let cardFeeling = Card.FeelingEvolution[this.feeling];
      for(let i=0;i<cardFeeling.length;i++) {
        let hasFound = false;
        let feelingType = Card.FeelingEvolution[feeling.type];
        for(let j=0;j<feelingType.length;j++) {
          if(cardFeeling[i]==feelingType[j]) {
            hasFound = true;
            break;
          }
        }
        if(!hasFound) {
          return false;
        }
      }
      return true;
    }
    getTarget(feeling) {
      let target;
      if(this.self) {
        target = feeling;
      } else {
        target = feeling.player.target.feeling;
      }
      console.log("GetTarget:" + target.type);
      return target;
    }
    calculate(feeling) {

    }
    getPercentage(level) {
      return Math.floor(14.285714 * level + 0.01);
    }
}