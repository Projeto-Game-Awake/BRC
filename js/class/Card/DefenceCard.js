class DefenceCard extends Card {

    constructor(index) {
        super(index);
        this.type = Card.Type.DEFENCE;
        this.self = true;
    }
    
    calculate(feeling) {
        feeling.shield += feeling.defence;
        return [feeling];
    }

}