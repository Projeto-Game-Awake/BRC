class Deck {

    constructor() {
        this.load();
        this.hand = [];
        this.used = [];
    }

    load() {
        this.cards = [
            new DoubleHitRateCard(),
            new AttackHumildadeSimpleCard(),
            new AttackHumildadeSimpleCard(),
            new AttackHumildadeSimpleCard(),
            new DefenceHumildadeSimpleCard(),
            new DefenceHumildadeSimpleCard(),
            new DefenceHumildadeSimpleCard(),
        ];
    }

    reload() {
        this.cards = this.used;
        this.used = [];
    }

}