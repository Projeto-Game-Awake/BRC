class AttackCard extends Card {

    constructor(index) {
        super(index);
        this.type = Card.Type.ATTACK;
    }
    
    calculate(feeling) {
        let target = this.getTarget(feeling);

        let actions = [];
        let total = feeling.hit / 100;
        
        actions.push(target);

        console.log("TOTAL:"+total);

        for(let i=0;i<total;i++) {
            console.log("Y"+target.parentContainer.y);
            target.shield -= feeling.attack;
            console.log("SHIELD:"+target.shield);
            if(target.shield <= 0) {
                target.hp += target.shield
                target.shield = 0;
                if(target.hp <= 0) {
                    console.log(12345);
                    target.hp = 0;
                    target.player.grid.count--;
                    target = target.player.newTarget();
                    if(target === false) {
                        return actions;
                    }
                }
            }
            actions.push(target);
        }
        return actions;
    }

}