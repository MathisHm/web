class Laser {
    constructor(x, y, size = 1, orientation = 'horizontal', state = 'static') {
        this.x = x;
        this.y = y;
        this.initialX = x;
        this.initialY = y;
        this.image = new Image();
        this.image.src = 'images/laser.png';
        this.imgWidth = 150;
        this.imgHeight = 20;
        this.size = size;
        this.orientation = orientation;
        this.state = state;
        this.moveLength = 1;
        this.direction = 1;
        this.isImageLoaded = false;
        this.image.onload = () => this.isImageLoaded = true;
    }

    draw(ctx) {
        if (this.isImageLoaded) {
            if (this.state === 'dynamic') {
                const maxMoveDistance = this.moveLength * (this.orientation === 'horizontal' ? this.imgWidth : this.imgHeight);
                if (this.orientation === 'horizontal') {
                    this.x += this.direction;
                    if (this.x >= this.initialX + maxMoveDistance || this.x <= this.initialX) {
                        this.direction *= -1;
                    }
                } else if (this.orientation === 'vertical') {
                    this.y += this.direction;
                    if (this.y >= this.initialY + maxMoveDistance || this.y <= this.initialY) {
                        this.direction *= -1;
                    }
                }
            }
            if (this.orientation === 'horizontal') {
                for (let i = 0; i < this.size; i++) {
                    ctx.drawImage(
                        this.image,
                        this.x + i * this.imgWidth,
                        this.y,
                        this.imgWidth,
                        this.imgHeight
                    );
                }
            } else if (this.orientation === 'vertical') {
                for (let i = 0; i < this.size; i++) {
                    ctx.drawImage(
                        this.image,
                        this.x,
                        this.y + i * this.imgHeight,
                        this.imgWidth,
                        this.imgHeight
                    ); 
                }
            }
        }
    }

    checkCollision(player) {
        const obstacleWidth = this.orientation === 'horizontal' ? this.imgWidth * this.size : this.imgWidth;
        const obstacleHeight = this.orientation === 'vertical' ? this.imgHeight * this.size : this.imgHeight;

        if (
            player.x < this.x + obstacleWidth &&
            player.x + player.width > this.x &&
            player.y < this.y + obstacleHeight &&
            player.y + player.height > this.y
        ) {
            player.dead = true;
        }
    }
}