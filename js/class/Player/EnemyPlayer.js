class EnemyPlayer extends Player {

    constructor(scene,units) {
        super(scene);
        this.first = 0;
        this.skipFeeling = 3;
        this.units = units;
    }

    selectCards() {
        for(let i=0;i<3;i++) {
            let card = this.popDeck();
            this.addSpecialPoint(card,this.scene.left[0]);
        }
    }

}