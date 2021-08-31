class DoubleHitRateCard extends MagicCard {

    constructor() {
        super(2);
        this.self = true;
        this.spritesheet = "humildadecard";
        this.feeling = 0;
    }

    calculate(feeling) {
        feeling.hit = feeling.hit * 2;
        return [feeling];
    }

}