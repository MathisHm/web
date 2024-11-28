let levels = [];
let players;
let currentLevelIndex = 0;
let currentLevel;
let isGameOver = false;

let sounds = {
    backgroundMusic: new Audio('sounds/backgroundMusic.mp3'),
};

window.onload = init;

let countdown = 4;

async function init() {
    await loadLevels();
    canvas = document.querySelector("#gameCanvas");
    w = canvas.width;
    h = canvas.height;
    ctx = canvas.getContext('2d');

    const playerCount = getPlayerCount();
    players = [];
    addPlayers(playerCount);

await runCountdown();
    loadLevel(currentLevelIndex);

    document.addEventListener("keydown", controlDown, false);
    document.addEventListener("keyup", controlUp, false);
    document.addEventListener("keydown", controlGameOver, false);

    sounds.backgroundMusic.loop = true;
    sounds.backgroundMusic.play();

    requestAnimationFrame(mainloop);
}

function getPlayerCount() {
    let count;
    do {
        count = parseInt(prompt("Enter the number of players (1 to 4):"), 10);
    } while (isNaN(count) || count < 1 || count > 4);
    return count;
}

function addPlayers(count) {
    const playerData = [
        { name: 'Green', x: 10, y: 10, color: 'green', controls: 'WASD' },
        { name: 'Blue', x: 10, y: 70, color: 'blue', controls: 'Arrow keys' },
        { name: 'Yellow', x: 10, y: 130, color: 'yellow', controls: 'IJKL' },
        { name: 'Red', x: 10, y: 190, color: 'red', controls: 'FCVB' }
    ];

    const controlsInfo = document.getElementById("controlsInfo");
    controlsInfo.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const data = playerData[i];
        players.push(new Player(data.name, data.x, data.y, 50, 50, data.color));

        const controlText = document.createElement('p');
        controlText.style.color = data.color;
        controlText.textContent = `${data.name} Player Controls: ${data.controls}`;
        controlsInfo.appendChild(controlText);
    }
}



async function runCountdown() {
    return new Promise(resolve => {
        let interval = setInterval(() => {
            ctx.clearRect(0, 0, w, h);
            ctx.font = '72px Arial';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.fillText(`${countdown}`, w / 2, h / 2);

            countdown -= 1;

            if (countdown < 0) {
                clearInterval(interval);
                ctx.clearRect(0, 0, w, h);
                resolve();
            }
        }, 1000);
    });
}

function mainloop() {
    if (!isGameOver) {
        ctx.clearRect(0, 0, w, h);
        currentLevel.draw(ctx);
        currentLevel.checkCollisions(players);

        players.forEach(player => {
            if (!player.finished && !player.dead) {
                player.draw(ctx);
                player.move(w, h, players);
            }
        });

        if (players.every(player => player.dead)) {
            isGameOver = true;
        }

        currentLevel.manageLevel(players, () => {
            currentLevelIndex += 1;
            loadLevel(currentLevelIndex);
        });
    } else {
        displayGameOver();
    }
    requestAnimationFrame(mainloop);
}

async function loadLevels() {
    try {
        const response = await fetch('levels.json');
        levels = await response.json();
        levels.forEach(level => {
            level.walls = level.walls.map(wall => {
                const size = wall.size || 1;
                const orientation = wall.orientation || 'horizontal';
                const state = wall.state || 'passive';
                return new Wall(wall.x, wall.y, size, orientation, state);
            });
            level.lasers = level.lasers.map(laser => {
                const width = laser.width || 150;
                return new Laser(laser.x, laser.y, width);
            });
            level.bonuses = level.bonuses.map(bonus => {
                return new Bonus(bonus.x, bonus.y, bonus.number)
            });
        });
    } catch (error) {
        console.error("Failed to load levels: ", error);
    }
}

function loadLevel(levelIndex) {
    if (levelIndex < levels.length) {
        currentLevel = new Level(levels[levelIndex]);
        currentLevel.setupLevel(players);
    } else {
        isGameOver = true;
    }
}

function displayGameOver() {
    ctx.clearRect(0, 0, w, h);

    ctx.font = '48px Arial';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', w / 2, h / 2 - 50);

    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    players.forEach((player, index) => {
        ctx.fillText(`${player.name}: ${player.points} points`, w / 2, h / 2 + index * 30);
    });

    ctx.font = '20px Arial';
    ctx.fillStyle = 'blue';
    ctx.fillText('Press R to restart', w / 2, h / 2 + players.length * 30 + 40);
}


function controlDown(evt) {
    switch (evt.code) {
        // Player 1 (WASD)
        case 'KeyW':
            players[0].speedY = -players[0].speed;
            break;
        case 'KeyS':
            players[0].speedY = players[0].speed;
            break;
        case 'KeyA':
            players[0].speedX = -players[0].speed;
            break;
        case 'KeyD':
            players[0].speedX = players[0].speed;
            break;

        // Player 2 (Arrow keys)
        case 'ArrowUp':
            players[1].speedY = -players[1].speed;
            break;
        case 'ArrowDown':
            players[1].speedY = players[1].speed;
            break;
        case 'ArrowLeft':
            players[1].speedX = -players[1].speed;
            break;
        case 'ArrowRight':
            players[1].speedX = players[1].speed;
            break;

        // Player 3 (IJKL)
        case 'KeyI':
            players[2].speedY = -players[2].speed;
            break;
        case 'KeyK':
            players[2].speedY = players[2].speed;
            break;
        case 'KeyJ':
            players[2].speedX = -players[2].speed;
            break;
        case 'KeyL':
            players[2].speedX = players[2].speed;
            break;

        // Player 4 (FCVB)
        case 'KeyF':
            players[3].speedY = -players[3].speed;
            break;
        case 'KeyV':
            players[3].speedY = players[3].speed;
            break;
        case 'KeyC':
            players[3].speedX = -players[3].speed;
            break;
        case 'KeyB':
            players[3].speedX = players[3].speed; 
            break;
    }
}

function controlUp(evt) {
    switch (evt.code) {
        // Player 1 (WASD)
        case 'KeyW':
        case 'KeyS':
            players[0].speedY = 0;
            break;
        case 'KeyA':
        case 'KeyD':
            players[0].speedX = 0;
            break;

        // Player 2 (Arrow keys)
        case 'ArrowUp':
        case 'ArrowDown':
            players[1].speedY = 0;
            break;
        case 'ArrowLeft':
        case 'ArrowRight':
            players[1].speedX = 0;
            break;

        // Player 3 (IJKL)
        case 'KeyI':
        case 'KeyK':
            players[2].speedY = 0; 
            break;
        case 'KeyJ':
        case 'KeyL':
            players[2].speedX = 0;
            break;

        // Player 4 (FCVB)
        case 'KeyF':
        case 'KeyV':
            players[3].speedY = 0;
            break;
        case 'KeyC':
        case 'KeyB':
            players[3].speedX = 0;
            break;
    }
}

function controlGameOver(evt) {
    if (isGameOver) {
        if (evt.code === 'KeyR') {
            location.reload();
        } else if (evt.code === 'KeyEscape') {
            console.log('Exiting game...');
        }
    }
}