class Player {

    constructor(scene, first = 7) {
        this.scene = scene;
        this.first = first;
        this.skipFeeling = 0;
        this.count = 0;
        this.units = [
            {
                x:2,
                y:2,
                type:0
            }
        ];
        this.deck = new Deck();
        this.suffleCard();
    }

    setExplore() {
        this.first = 4;
    }

    setBattle() {
        this.first = 7;
        this.count = 0;
        this.deck = new Deck();
        this.suffleCard();
    }

    suffleCard() {
        let newOrder = [];
        let i = 0;
        while (this.deck.cards.length > 0) {
            newOrder[i++] = this.deck.cards.splice(
            Phaser.Math.Between(0, this.deck.cards.length - 1),
            1
            )[0];
        }
        this.deck.cards = newOrder;
    }
    showDeck(scene) {
        let startY = options.marginY;
        for(let i=0;i<3;i++) {
            let card = this.popDeck();
            card.draw(scene,this,32 + 45 + 5 * options.plotSize,startY);
            startY += 130;
        }
    }
    popDeck() {
        let card = this.deck.cards.splice(0,1)[0];
        this.deck.hand.push(card);
        if(this.deck.cards.length == 0) {
            this.deck.reload();
            this.suffleCard();
        }
        return card;
    }
    popHand(card) {
        for(let i=0;i<this.deck.hand.length;i++) {
            if(card == this.deck.hand[i]) {
                this.deck.hand.splice(i,1);
                break;
            }
        }
        this.deck.used.push(card);
        this.addSpecialPoint(card, this.grid);
        this.count++;
    }
    addSpecialPoint(card,grid) {
        for (let index = 0; index < this.units.length; index++) {
            let feeling = grid.plot[this.units[index].x][this.units[index].y].feeling;
            if(card.isMatch(feeling)) {
                feeling.addSpecialPoint(card);
            }
        }
    }
    setFeelingTarget(myGrid,enemyGrid,enemy) {
        this.grid = myGrid;
        this.enemyGrid = enemyGrid;
        this.target = enemyGrid.plot[enemy.units[0].x][enemy.units[0].y];
    }
    hasEnded() {
        if(this.grid.count == 0) {
            this.scene.hasWon = this instanceof EnemyPlayer;
        }
        if(this.enemyGrid.count == 0) {
            this.scene.hasWon = !(this instanceof EnemyPlayer);
        }
        this.scene.message = this.scene.hasWon ? "Vitória" : "Derrota";
        console.log(this.enemyGrid.count + "%" + this.grid.count);
        return this.grid.count == 0 || this.enemyGrid.count == 0;
    }
    newTarget() {
        let units = this.grid.player.units;
        console.log(units);
        for(let i=0;i<units.length;i++) {
          let newFeeling = this.grid.plot[units[i].x][units[i].y].feeling;
          console.log(newFeeling.hp);
          if(newFeeling.hp > 0) {
            console.log("NEWTARGET:"+newFeeling.parentContainer.y);
            return newFeeling;
          }
        }
        console.log("NEWTARGET:"+false);
        return false;
    }
}