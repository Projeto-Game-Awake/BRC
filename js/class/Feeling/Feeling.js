class Feeling extends Phaser.GameObjects.Container {

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

    constructor(scene, player, x, y, type, skip, level, scale=1) {
        let stats = scene.cache.json.get("feeling")[type];
        let side = player instanceof EnemyPlayer ? 1 : 0;                
        let name = side == 1 ? stats.shadow : stats.light;        
        let sprite = scene.add.sprite(0,0,"feeling"+scale,type+skip);
        let label = scene.add.text(0,-20*scale,name,{
            fontSize: 10,
            fontFamily: 'Courier New',
            align: "center",
            backgroundColor:"#000",
            color:'#FFFFFF',
            wordWrap: { width: 780, useAdvancedWrap: true }
          });
        label.setOrigin(0.5);

        super(scene,x,y,[sprite,label]);

        this.scene = scene;
        this.player = player;
        this.level = level;
        this.type = type;
        this.pos = -1;
        this.actions = [];
        this.specials = [];
        this.scale = scale;

        this.stats = stats;
        this.reset();
        scene.add.existing(this);
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
            new Phaser.Geom.Rectangle(0, 0, 64, 64),
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