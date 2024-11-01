class Level {
    constructor(levelData) {
        this.startPosition = levelData.startPosition;
        this.walls = levelData.walls;
        this.lasers = levelData.lasers;
        this.exit = new Exit(levelData.exit.x, levelData.exit.y);
        this.points = levelData.points;
        this.playersFinishedOrder = [];
    }

    setupLevel(players) {
        players.forEach((player, index) => {
            player.x = this.startPosition[index].x;
            player.y = this.startPosition[index].y;
            player.finished = false;
            player.speedX = 0;
            player.speedY = 0;
        });
        this.playersFinishedOrder = [];
    }

    draw(ctx) {
        this.exit.draw(ctx);
        this.walls.forEach(wall => wall.draw(ctx));
        this.lasers.forEach(laser => laser.draw(ctx));
    }

    checkCollisions(players) {
        players.forEach(player => {
            if (this.exit.checkCollision(player) && !player.finished) {
                player.finished = true;
                this.playersFinishedOrder.push(player);
            }
            this.walls.forEach(wall => {
                if (wall.checkCollision(player)) {
                    player.speedX = 0;
                    player.speedY = 0;
                }
            });
            this.lasers.forEach(laser => laser.checkCollision(player));
        });
    }

    manageLevel(players, loadNextLevel) {
        if (this.playersFinishedOrder.length === players.length) {
            if (this.playersFinishedOrder[0]) this.playersFinishedOrder[0].points += 4;
            if (this.playersFinishedOrder[1]) this.playersFinishedOrder[1].points += 3;
            if (this.playersFinishedOrder[2]) this.playersFinishedOrder[2].points += 2;
            if (this.playersFinishedOrder[3]) this.playersFinishedOrder[3].points += 1;

            this.playersFinishedOrder = [];
            loadNextLevel();
        }
    }
}
