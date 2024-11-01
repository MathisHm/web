class Exit {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = 'images/exit.png';
        this.imgWidth = 100;
        this.imgHeight = 100;
        this.isImageLoaded = false;
        this.image.onload = () => this.isImageLoaded = true;
    }

    draw(ctx) {
        if (this.isImageLoaded) {
            ctx.drawImage(this.image, this.x, this.y, this.imgWidth, this.imgHeight);
        }
    }

    checkCollision(player) {
        return (
            player.x < this.x + this.imgWidth &&
            player.x + player.width > this.x &&
            player.y < this.y + this.imgHeight &&
            player.y + player.height > this.y
        );
    }
    
}
