class SetupGrid extends BattleGrid {

    constructor(scene, isCurrent, player, ident = {x:0,y:0}, area) {
        super(scene,isCurrent,player,ident,area)

        this.draw();
    }
    draw() {
        for(let i=0;i<this.plot.length;i++) {
            for(let j=0;j<this.plot[i].length;j++) {
                this.plot[i][j].setClick(this.selectHandle(i,j));
            }
        }
    }
    selectHandle(i,j) {
        return (pointer) => {

            if (pointer.rightButtonDown())
            {
                
            }
            else
            {
                if(this.selection) {

                    let temp = this.plot[i][j];
                    this.plot[i][j] = this.plot[this.selection.i][this.selection.j];
                    this.plot[this.selection.i][this.selection.j] = temp;

                    this.plot[i][j].swap(temp);

                    for(let k=0;k<this.plot.length;k++) {
                        for(let l=0;l<this.plot[k].length;l++) {
                            this.plot[k][l].alpha = 1
                            this.plot[k][l].setClick(this.selectHandle(k,l));
                        }
                    }

                    for(let k=0;k<this.player.units.length;k++) {
                        if(this.player.units[k].x == i &&
                           this.player.units[k].y == j) {
                            this.player.units[k].x = this.selection.i;
                            this.player.units[k].y = this.selection.j;
                        } else if(this.player.units[k].x == this.selection.i &&
                            this.player.units[k].y == this.selection.j) {
                             this.player.units[k].x = i;
                             this.player.units[k].y = j;
                         }
                    }
                    
                    this.player.grid.plot = this.plot;
                    this.selection = null;
                    this.scene.scene.start("explore");
                } else {
                    for(let k=0;k<this.plot.length;k++) {
                        for(let l=0;l<this.plot[k].length;l++) {
                            this.plot[k][l].alpha = 0.8
                        }
                    }
                    this.plot[i][j].alpha = 1
                    this.selection = {i:i,j:j}
                }
            }
    
        };
    }
    getTablePosition(i,j) {
        return {
            x : 45 + i * options.plotSize,
            y : options.marginY + j * options.plotSize,
        }
    }
    disable() {
        for (let i = 0; i < this.plot.length; i++) {
            for (let j = 0; j < this.plot[i].length; j++) {
                this.plot[i][j].disable();
            }
        }
    }
    clear() {
        for(let i=0;i<this.arrows.length;i++) {
            this.arrows[i].destroy();
        }
        for (let i = 0; i < this.plot.length; i++) {
            for (let j = 0; j < this.plot[i].length; j++) {
                this.plot[i][j].destroy();
            }
        }
        for (let i = 0; i < this.borders.length; i++) {
            this.borders[i].destroy();
        }

    }
}