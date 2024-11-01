class Wall {
    constructor(x, y, size = 1, orientation = 'horizontal', state = 'passive') {
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = 'images/wall.png';
        this.imgWidth = 50;
        this.imgHeight = 50;
        this.size = size;
        this.orientation = orientation;
        this.state = state;
        this.isImageLoaded = false;
        this.image.onload = () => this.isImageLoaded = true;
    }

    draw(ctx) {
        if (this.isImageLoaded) {
            if (this.orientation === 'horizontal') {
                for (let i = 0; i < this.size; i++) {
                    ctx.drawImage(
                        this.image,
                        this.x + i * this.imgWidth,
                        this.y,
                        this.imgWidth,
                        this.imgHeight
                    );
                    if (this.state === 'hostile') {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                        ctx.fillRect(this.x + i * this.imgWidth, this.y, this.imgWidth, this.imgHeight);
                    }
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
                    if (this.state === 'hostile') {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                        ctx.fillRect(this.x, this.y + i * this.imgHeight, this.imgWidth, this.imgHeight);
                    }
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
            const overlapLeft = (player.x + player.width) - this.x;
            const overlapRight = (this.x + obstacleWidth) - player.x;
            const overlapTop = (player.y + player.height) - this.y;
            const overlapBottom = (this.y + obstacleHeight) - player.y;

            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
            
            if (this.state === 'hostile') {
                player.dead = true;
            }

            if (minOverlap === overlapLeft) {
                player.x = this.x - player.width;
                player.speedX = -player.speedX;
            } else if (minOverlap === overlapRight) {
                player.x = this.x + obstacleWidth;
                player.speedX = -player.speedX;
            } else if (minOverlap === overlapTop) {
                player.y = this.y - player.height;
                player.speedY = -player.speedY;
            } else if (minOverlap === overlapBottom) {
                player.y = this.y + obstacleHeight;
                player.speedY = -player.speedY;
            }
        }
    }
}
