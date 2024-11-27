class Laser {
    constructor(x, y, width) {
        this.x = x;
        this.y = y;
        this.initialX = x;
        this.initialY = y;
        this.width = width;
        this.image = new Image();
        this.image.src = 'images/laser.png';
        this.imgWidth = 150;
        this.imgHeight = 20;
        this.moveLength = 1;
        this.direction = 1;
        this.isImageLoaded = false;
        this.image.onload = () => this.isImageLoaded = true;

        this.sounds = {
            laserCollision: new Audio('sounds/laserCollision.mp3'),
        };
    }

    draw(ctx) {
        if (this.isImageLoaded) {
            const maxMoveDistance = this.moveLength * this.imgWidth;
            this.x += this.direction;
            if (this.x >= this.initialX + maxMoveDistance || this.x <= this.initialX) {
                this.direction *= -1;
            }
            ctx.drawImage(this.image, this.x, this.y, this.width, this.imgHeight);
        }
    }

    checkCollision(player) {
        const obstacleWidth = this.width;
        const obstacleHeight = this.imgHeight;

        if (
            player.x < this.x + obstacleWidth &&
            player.x + player.width > this.x &&
            player.y < this.y + obstacleHeight &&
            player.y + player.height > this.y &&
            !player.dead
        ) {
            this.sounds.laserCollision.play();
            player.dead = true;
        }
    }
}