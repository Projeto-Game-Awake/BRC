class BattleGrid {

    constructor(scene, isCurrent, player, ident, area) {
        this.scene = scene;
        this.isCurrent = isCurrent;
        this.player = player;
        this.ident = ident;
        this.area = area;
        this.plot = [];

        if(area == null) {
            return;
        }

        this.units = [];
        for (let i = 0; i < 5; i++) {
            this.units[i] = [];
            for (let j = 0; j < 5; j++) {
                this.units[i][j] = null;
            }
        }
        for(let i=0;i<this.player.units.length;i++) {
            this.units[this.player.units[i].x][this.player.units[i].y] = this.player.units[i];
        }

        this.count = this.player.units.length;

        for (let i = 4; i >= 0; i--) {
            this.plot[i] = [];
            for (let j = 4; j >= 0; j--) {
                let coords = this.getTablePosition(this.player.first + i + ident.x,j+ident.y);
                this.plot[i][j] = new Plot(
                    scene,
                    this.player,
                    coords.x,
                    coords.y,
                    isCurrent,
                    this.units[i][j]
                );
            }
        }
    }

    getTablePosition(i,j) {
        return {
            x : 45 + i * options.plotSize,
            y : options.marginY + j * options.plotSize,
        }
    }

    getFeelingWithAction() {
        let feelings = [];
        for(let i=0;i<this.player.units.length;i++) {
            let feeling = this.player.units[i];
            if(this.plot[feeling.x][feeling.y].feeling.hasAction()) {
                this.plot[feeling.x][feeling.y].feeling.grid = this;
                feelings.push(this.plot[feeling.x][feeling.y].feeling);
            }
        }
        return feelings;
    }

    reset() {
        for(let i=0;i<this.player.units.length;i++) {
            this.plot[this.player.units[i].x][this.player.units[i].y].feeling.reset();
        }
    }
}