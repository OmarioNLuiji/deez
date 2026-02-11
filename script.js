// ==============================
// CONFIG
// ==============================
const TILE_SIZE = 10;
const GRID_SIZE = 70;

// ==============================
// SETUP
// ==============================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = GRID_SIZE * TILE_SIZE;
canvas.height = GRID_SIZE * TILE_SIZE;

// ==============================
// MAP GENERATION
// ==============================

let map = [];

function generateMap() {
    for (let y = 0; y < GRID_SIZE; y++) {
        let row = [];
        for (let x = 0; x < GRID_SIZE; x++) {
            if (
                x === 0 ||
                y === 0 ||
                x === GRID_SIZE - 1 ||
                y === GRID_SIZE - 1
            ) {
                row.push(1); // border wall
            } else if (Math.random() < 0.08) {
                row.push(1); // random walls
            } else {
                row.push(0); // empty
            }
        }
        map.push(row);
    }
}

generateMap();

// ==============================
// PLAYER
// ==============================

const player = {
    x: 1,
    y: 1,
    color: "red",
    moveCooldown: 0,
    moveDelay: 100 // ms between tile moves
};

// ==============================
// INPUT
// ==============================

const keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

// ==============================
// GAME LOGIC
// ==============================

function canMove(x, y) {
    if (x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE) return false;
    return map[y][x] === 0;
}

function update(deltaTime) {
    player.moveCooldown -= deltaTime;

    if (player.moveCooldown > 0) return;

    let newX = player.x;
    let newY = player.y;

    if (keys["arrowup"] || keys["w"]) newY--;
    else if (keys["arrowdown"] || keys["s"]) newY++;
    else if (keys["arrowleft"] || keys["a"]) newX--;
    else if (keys["arrowright"] || keys["d"]) newX++;

    if (canMove(newX, newY)) {
        player.x = newX;
        player.y = newY;
    }

    player.moveCooldown = player.moveDelay;
}

// ==============================
// RENDERING
// ==============================

function drawMap() {
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (map[y][x] === 1) {
                ctx.fillStyle = "#333";
                ctx.fillRect(
                    x * TILE_SIZE,
                    y * TILE_SIZE,
                    TILE_SIZE,
                    TILE_SIZE
                );
            }
        }
    }
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(
        player.x * TILE_SIZE,
        player.y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
    );
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    drawPlayer();
}

// ==============================
// GAME LOOP
// ==============================

let lastTime = 0;

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

