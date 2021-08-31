class ExploreGrid extends BattleGrid {

    static direction = {
        UP : 0,
        RIGHT : 1,
        DOWN : 2,
        LEFT : 3
    }

    static directionMove = [
        {x:0,y:1},
        {x:1,y:0},
        {x:0,y:-1},
        {x:-1,y:0},
    ]

    constructor(scene, isCurrent, player, ident = {x:0,y:0}, area) {
        super(scene,isCurrent,player,ident,area)

        this.borders = [];
        this.arrows = [];

        if(area == null) {
            return;
        }

        this.border = scene.cache.json.get(area.border);

        let index = -1;
        index = this.drawBorder(index,1,-1,0,-1);
        index = this.drawBorder(index,0,5,1,-1);
        index = this.drawBorder(index,-1,5,0,5);
        index = this.drawBorder(index,0,-1,-1,5);

        if(isCurrent) {
            this.arrows.push(this.drawArrow(6+ident.x,-1.5+ident.y,ExploreGrid.direction.UP));
            this.arrows.push(this.drawArrow(9.5+ident.x,2+ident.y,ExploreGrid.direction.RIGHT));
            this.arrows.push(this.drawArrow(6+ident.x,5.5+ident.y,ExploreGrid.direction.DOWN));
            this.arrows.push(this.drawArrow(2.5+ident.x,2+ident.y,ExploreGrid.direction.LEFT));

            this.doArrowEnabled();
        }
    }
    doArrowEnabled() {
        for(let direction=0;direction<this.arrows.length;direction++) {
            let position = this.getNewPosition(this.scene.scenario.start,direction, true);
            if(position === false) {
                this.arrows[direction].alpha = 0.2;
            } else {
                this.arrows[direction].alpha = 1;
            }
        }
    }
    drawBorder(index, x, startX, y, startY) {
        for (let i = 1; i < 7; i++) {
            index++;
            if(this.border[index].sprite == -1) {
                continue;
            }
            let coords = this.getTablePosition(
                this.player.first + i * x + startX + this.ident.x,
                i * y + startY + this.ident.y);
            let plot = this.scene.add.sprite(coords.x,coords.y,this.border[index].sheet,this.border[index].sprite);
            this.borders.push(plot);
            if(!this.isCurrent) {
                plot.alpha = 0.2;
            }
        }
        return index;
    }
    drawArrow(x,y,direction) {
        this.coords = this.getTablePosition(x,y);
        let arrow = this.scene.add.sprite(this.coords.x,this.coords.y,"setas",direction);
        arrow.setInteractive();
        arrow.on(
        "pointerdown",
        function () {
            let position = this.getNewPosition(this.scene.scenario.start,direction, true);
            if(position !== false) {
                this.scene.drawCurrent(this.getNewPosition(this.scene.scenario.start,direction));
            }
        },
        this
        );
        return arrow;
    }
    getNewPosition(start,direction,isReadOnly = false) {
        start.x += ExploreGrid.directionMove[direction].x;
        start.y += ExploreGrid.directionMove[direction].y;
        
        if(start.x == 0 || start.x + 1 == this.scene.gridLines.length ||
           start.y == 0 || start.y + 1 == this.scene.gridLines[start.x].length) {
            start.x -= ExploreGrid.directionMove[direction].x;
            start.y -= ExploreGrid.directionMove[direction].y;
            return false;
        }

        if(this.scene.gridLines[start.x][start.y] == null) {
            start.x -= ExploreGrid.directionMove[direction].x;
            start.y -= ExploreGrid.directionMove[direction].y;
            return false;
        }

        if(isReadOnly) {
            start.x -= ExploreGrid.directionMove[direction].x;
            start.y -= ExploreGrid.directionMove[direction].y;
        }

        return start;
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
    reset() {
        this.up.destroy();
        this.right.destroy();
        this.down.destroy();
        this.left.destroy();
    }
}