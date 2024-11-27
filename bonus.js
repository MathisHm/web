class Bonus {

    constructor(x, y, number) {
        this.x = x;
        this.y = y;
        this.number = number;
        this.collected = false;
    }

    draw(ctx) {
        if (!this.collected) {
            ctx.font = '30px Arial';
            ctx.fillStyle = 'red';
            ctx.textAlign = 'center';
            ctx.fillText(`+${this.number}`, this.x, this.y);
        }
    }

    checkCollision(player) {
        if (this.collected) return false;
        if (
            !player.dead &&
            !player.finished &&
            player.x < this.x + 30 &&
            player.x + player.width > this.x - 30 &&
            player.y < this.y + 30 &&
            player.y + player.height > this.y - 30
        ) {
            this.collected = true;
            return true;
        }
    }
}
