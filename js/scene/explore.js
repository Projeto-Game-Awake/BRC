class Explore extends Phaser.Scene
{

    constructor ()
    {
        super('explore');
        this.grids = [];
    }

    init(data) {
      this.nextPhase = false;
      this.sceneName = data.sceneName;
      if(data.scenario) {
        this.scenario = data.scenario;
        if(this.scenario.hasWon === true) {
          if(this.hasAchieveObjective()) {
            this.nextPhase = true;  
          }
        } else {
          this.message = "Tente novamente";
        }
      } else {
        this.scenario = null;
      }
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
      this.load.spritesheet("humildadecard", "assets/spritesheets/humildadecard.png", {
        frameWidth: options.feelingSize,
        frameHeight: options.feelingSize,
      });     
      this.load.spritesheet("setas", "assets/spritesheets/setas.png", {
        frameWidth: options.feelingSize,
        frameHeight: options.feelingSize,
      });
      let borders = [];
      let spritesheets = [];
      this.load.json('feeling', "data/feeling.json"); 

      this.load.json(this.sceneName, "scenario/" + this.sceneName + ".json"); 
      this.load.on('filecomplete-json-' + this.sceneName, (key, type, data) => {
        let areas = data.areas;
        for (let index = 0; index < areas.length; index++) {
          const borderName = areas[index].border;
          if(borders.indexOf(borderName)==-1) {
            borders.push(borderName);
            this.load.json(borderName, "scenario/border/" + borderName + ".json"); 
            this.load.on('filecomplete-json-'+borderName, (key, type, borderData) => {
              for (let index = 0; index < areas.length; index++) {
                const spritesheetName = borderData[index].sheet;
                if(spritesheets.indexOf(spritesheetName)==-1) {
                  spritesheets.push(spritesheetName);
                  const spritesheetFileName = `assets/spritesheets/${spritesheetName}.png`
                  this.load.spritesheet(spritesheetName, spritesheetFileName, {
                    frameWidth: options.plotSize,
                    frameHeight: options.plotSize,
                  });   
                }
              }
            });
          }
        }
      });
    }

    create ()
    {
      if(this.nextPhase) {
        this.cameras.main.fadeOut(1000);
        this.nextPhase = false;
        this.scenario = null;
        this.endExplore();
        return;
      }
      if(this.scenario == null) {
        this.scenario = this.cache.json.get(this.sceneName);
        let count = 0;
        for(let i=0;i<this.scenario.areas.length;i++) {
          if(this.scenario.areas[i].grid) {
            count++;
          }
        }
        this.scenario.enemyCount = count;
      }
      myPlayer.setExplore();

      this.gridLines = [];
      for(let i=0;i<this.scenario.width+2;i++) {
        this.gridLines[i] = [];
        for(let j=0;j<this.scenario.height+2;j++) {
          this.gridLines[i][j] = null;
        }
      }

      for(let i=0;i<this.scenario.areas.length;i++) {
        let area = this.scenario.areas[i];
        this.gridLines[area.x][area.y] = i;
      }
      this.drawCurrent(this.scenario.start);
    }

    endExplore() {
      this.scenario = null;
      this.scene.start("selectPhase", {phases:1});
    }

    hasAchieveObjective() {
      return this.scenario.enemyCount == 0;
    }

    drawCurrent(start) {
      if(start === false) {
        return;
      }

      if(!this.scenario.hasWon && typeof this.scenario.areas[
        this.gridLines[start.x][start.y]].grid !== "undefined") {
          this.before.disable();
          this.scene.start("battle", {
            scenario:this.scenario,
            sceneName:this.sceneName,
            gridEnemy:this.scenario.areas[
              this.gridLines[start.x][start.y]].grid
          });
          return;
      }

      for(let i=0;i<this.grids.length;i++) {
        this.grids[i].clear();
      }

      let positions = [
        {x:-1,y:-1},{x:0,y:-1},{x:1,y:-1},
        {x:-1,y:0},{x:1,y:0},
        {x:1,y:1},{x:0,y:1},{x:-1,y:1},
      ]

      this.before = new ExploreGrid(this,
        true,
        myPlayer,{x:0,y:0},
        this.scenario.areas[
          this.gridLines[start.x][start.y]]);
      this.grids.push(this.before);

      for(let i=0;i<positions.length;i++) {
        let gridLine = this.gridLines[start.x-positions[i].x][start.y-positions[i].y];
        let area = this.scenario.areas[gridLine];
        if(typeof area === 'undefined' ) {
          area = null;
        }
        this.grids.push(
          new ExploreGrid(this,
            false,
            myPlayer,{
              x:positions[i].x*-5,
              y:positions[i].y*5},
              area));  
      }
    }
}