class Feeling extends Phaser.GameObjects.Sprite {

    static StatsColor = 
    {
        hp:0x0000ff,
        magic:0xff0000,
        attack:0x5e2129,
        spirit:0xffff00,
        defence:0xf9eac3,
        speed:0x008000,        
        hit:0xffa500,         
        will:0xee82ee,
        critical:0x4b0082
    }

    constructor(scene, player, x, y, type, skip, level) {
        super(scene,x,y,"feeling",type+skip);

        this.scene = scene;
        this.player = player;
        this.level = level;
        this.type = type;

        this.pos = -1;
        this.actions = [];
        this.specials = [];

        this.stats = scene.cache.json.get("feeling")[type];
        this.reset();
    }
    reset() {
        for(let i=0;i<this.specials.length;i++) {
            this.specials[i].destroy();
        }
        this.actions = [];
        this.specials = [];

        this.initSpecialPoint(-1);
        this.initSpecialPoint(0);
        this.initSpecialPoint(1);

        this.hp = this.stats.hp * this.level;
        this.attack = this.stats.attack * this.level;
        this.magic = this.stats.magic * this.level;
        this.defence = this.stats.defence * this.level;
        this.spirit = this.stats.spirit * this.level;
        this.speed = this.stats.speed * this.level;
        this.hit = this.stats.hit * this.level;
        this.will = this.stats.will * this.level;
        this.critical = this.stats.critical * this.level;

        this.shield = 0;

        this.pos = -1;
    }
    disable() {
        this.alpha = 0.2;
    }
    enable() {
        this.alpha = 1;
    }

    initSpecialPoint(pos) {
        let special = this.scene.add.circle(
            20*pos,
            30, 5, Card.Color[0]);
        special.setStrokeStyle(2, 0x9f9f9f);
        this.specials.push(special);
        special.alpha = 0;
    }
    addSpecialPoint(card) {
        this.actions.push(card);
        this.specials[++this.pos].alpha = 1;
        this.specials[this.pos].setFillStyle(Card.Color[card.type], 1);
        if(this.pos == 2) {
            this.pos = -1;
        }
    }
    hasAction() {
        return this.actions.length > 0;
    }
    getActions() {
        return this.actions;
    }
    isRetire() {
        return this.hp == 0;
    }
    retire() {
        if(this.alpha == 1) {
            this.disable();
        }
    }
}