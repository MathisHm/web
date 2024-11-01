class Player {
    constructor(name, x, y, width, height, color) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.points = 0;
        this.speed = 10;
        this.speedX = 0;
        this.speedY = 0;
        this.finished = false;
        this.dead = false;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }

    move(w, h, players) {
        const previousX = this.x;
        const previousY = this.y;
    
        this.x += this.speedX;
        this.y += this.speedY;
    
        if ((this.x + this.width) > w) {
            this.x = w - this.width;
            this.speedX = -Math.abs(this.speedX) * 0.5;
        }
        if (this.x < 0) {
            this.x = 0;
            this.speedX = Math.abs(this.speedX) * 0.5;
        }
        if ((this.y + this.height) > h) {
            this.y = h - this.height;
            this.speedY = -Math.abs(this.speedY) * 0.5;
        }
        if (this.y < 0) {
            this.y = 0;
            this.speedY = Math.abs(this.speedY) * 0.5;
        }
        players.forEach(player => {
            if (player !== this && this.checkCollision(player)) {
                this.x = previousX - this.speedX * 0.5;
                this.y = previousY - this.speedY * 0.5;
    
                this.speedX = -this.speedX * 0.5;
                this.speedY = -this.speedY * 0.5;
            }
        });
    }

    checkCollision(otherPlayer) {
        if (otherPlayer.finished || otherPlayer.dead) return false;
        return !(this.x > otherPlayer.x + otherPlayer.width ||
            this.x + this.width < otherPlayer.x ||
            this.y > otherPlayer.y + otherPlayer.height ||
            this.y + this.height < otherPlayer.y);
    }

    addPoints(n) {
        this.points += n;
    }

}
