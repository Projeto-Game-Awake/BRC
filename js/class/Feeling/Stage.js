class Stage extends Feeling {

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

    constructor(scene, player, x, y, type, skip, level, scale=1, unlocked,sceneName) {
        super(scene, player, x, y, type, skip, level, scale);
        let startX = -30;
        for(let i=0;i<unlocked;i++) {
            let star = scene.add.sprite(startX,40*scale,"estrelas");
            this.add(star);
            startX += 10;
        }
        for(let i=unlocked;i<7;i++) {
            let star = scene.add.sprite(startX,40*scale,"estrelas",1);
            this.add(star);
            startX += 10;
        }
        this.setClick(() => {
            scene.scene.start('explore',{
                sceneName: sceneName
            });
        });
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
    setClick(callback) {
        this.setSize(64, 64);
        this.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, 66, 120),
            Phaser.Geom.Rectangle.Contains
        );
        this.on("pointerdown", callback,this);
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