class Battle extends Phaser.Scene
{

    constructor ()
    {
        super('battle');
        this.left = [];
        this.right = [];
    }

    init(data) {
      this.scenario = data.scenario;
      this.sceneName = data.sceneName;
      this.gridEnemy = data.gridEnemy;
      this.reset();
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
      this.load.spritesheet("feeling", "assets/spritesheets/feeling.png", {
        frameWidth: options.feelingSize,
        frameHeight: options.feelingSize,
      });
    }

    create ()
    {
      let style = {
        fontSize: 24,
        fontFamily: 'Arial',
        align: "center",
        color:'#FFFF00',
        wordWrap: { width: 780, useAdvancedWrap: true }
      }
      let text = "O dinheiro faz homens ricos, o conhecimento faz homens sábios e a humildade faz grandes homens.";
      this.topMessage = this.add.text(10,10,text,style);

      this.cameras.main.fadeIn(1000, 0, 0, 0);

      myPlayer.scene = this;
      myPlayer.setBattle();
      this.right.push(new BattleGrid(this,true, myPlayer, {x:0,y:0}, 0));
      this.deck = myPlayer.showDeck(this);
      let enemy = new EnemyPlayer(this, this.gridEnemy);
      this.left.push(new BattleGrid(this,true,enemy, {x:0,y:0}, 0));
      myPlayer.setFeelingTarget(this.right[0],this.left[0],enemy);
      enemy.setFeelingTarget(this.left[0],this.right[0],myPlayer);
      enemy.selectCards();
      this.myPlayer = myPlayer;
    }

    doBattle() {
      let right = [];
      let left = [];
      for(let i=0;i<this.right.length;i++) {
        right = right.concat(this.right[i].getFeelingWithAction());
      }
      for(let i=0;i<this.left.length;i++) {
        left = left.concat(this.left[i].getFeelingWithAction());
      }

      this.selectOrder(right,left);

      this.reset();
    }

    selectOrder(right, left) {
      let order = [];
      order = this.addOrder(order,right);
      order = this.addOrder(order,left);
      this.process(order);
    }

    addOrder(order, newPart) {
      order = order.concat(newPart);
      for(let i=0;i<order.length-1;i++) {
        for(let j=i+1;j<order.length;j++) {
          if(order[i].speed > order[j].speed) {
            let temp = order[i];
            order[i] = order[j]
            order[j] = temp;
          }
        }
      }
      return order;
    }

    process(order) {
      let timeLine = this.tweens.createTimeline();
      for(let i=0;i<order.length;i++) {
        let feeling = order[i];
        let actions = feeling.getActions();

        for(let j=0;j<actions.length;j++) {

          let newActions = this.calculate(feeling,actions[j]);

          console.log(newActions.length);
          for(let k=0;k<newActions.length;k++) {

            let action = this.add.sprite(
              feeling.parentContainer.x,
              feeling.parentContainer.y,
              actions[j].spritesheet,
              actions[j].index);
            action.scale = 0.5;
            action.alpha = 0.5;

            timeLine.add({
                targets: action,
                scale: 0.5,
                alpha: 1,
                duration: 400,
                ease: "Linear"
                });
              let target = newActions[k];
              timeLine.add({
                targets: action,
                x: target.parentContainer.x,
                y: target.parentContainer.y,
                scale: 2,
                alpha:0.5,
                duration: 600,
                ease: "Linear",
                onComplete: () => {
                  action.destroy();
                },
                });

            if(target.isRetire()) {
              timeLine.add({
                targets: action,
                duration: 0,
                ease: "Linear",
                onComplete: () => {
                  target.retire();
                },
                });
            }
          }
          if(this.ended) {
            timeLine.add({
              targets: newActions[0],
              duration: 0,
              ease: "Linear",
              onComplete: () => {
                  this.scenario.hasWon = this.hasWon;
                  this.doEndBattle();
              },
              });
            break;
          } else {
            timeLine.add({
              targets: newActions[0],
              duration: 0,
              ease: "Linear",
              onComplete: () => {
                  myPlayer.count = 0;
              },
              });
          };
        }
        if(this.ended) {
          break;
        } else {
        }
      }

      if(!this.ended) {
        timeLine.add({
          targets: this.topMessage,
          duration: 0,
          ease: "Linear",
          onComplete: () => {
            this.startTurn();
          },
          });
      }
    timeLine.play();
  }

    calculate(feeling, action) {
      let actions = action.calculate(feeling);
      this.ended = feeling.player.hasEnded();
      console.log("END:"+this.ended);
      return actions;
    }

    doEndBattle() {
      this.showMessage();
    }
    showMessage() {
      let back = this.add.rectangle(0,0,800,600,0x000000);
      back.alpha = 0.6;
      back.setOrigin(0);

      const text = this.add.text(400, 300, this.message, { fontFamily: "Arial Black", fontSize: 82 });
      text.setOrigin(0.5);

      text.setStroke('#000000', 4);
      //  Apply the gradient fill.
      const gradient = text.context.createLinearGradient(0, 0, 0, text.height);

      if(this.hasWon) {
        this.scenario.enemyCount--;
        gradient.addColorStop(0, '#111111');
        gradient.addColorStop(.5, '#00ff00');
        gradient.addColorStop(.5, '#11aa11');
        gradient.addColorStop(1, '#111111');
      } else {
        gradient.addColorStop(0, '#111111');
        gradient.addColorStop(.5, '#ffffff');
        gradient.addColorStop(.5, '#aaaaaa');
        gradient.addColorStop(1, '#111111');
      }

      text.setFill(gradient);

      this.time.delayedCall(2500, this.doTransition, [], this);
    }
    doTransition() {
      this.cameras.main.fadeOut(800, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', (camera) => {
        if(this.hasWon) {
          this.scene.start("explore", {scenario:this.scenario,
            sceneName:this.sceneName});
        } else {
          this.scene.start("selectPhase");
        }
      }); 
    }
    startTurn() {
      for(let i=0;i<this.left.length;i++) {
        this.left[i].player.count = 0;
        this.left[i].player.selectCards();
      }
      for(let i=0;i<this.right.length;i++) {
        this.right[i].player.count = 0;
      }
    }
    reset() {
      for(let i=0;i<this.right.length;i++) {
        this.right[i].reset();
      }
      for(let i=0;i<this.left.length;i++) {
        this.left[i].reset();
      }
      this.right = [];
      this.left = [];
    }
}