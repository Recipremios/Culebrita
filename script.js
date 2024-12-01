const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 20;

let snake = [{ x: 10 * box, y: 10 * box }];
let direction = "RIGHT";
let food = {
    x: Math.floor(Math.random() * canvasSize) * box,
    y: Math.floor(Math.random() * canvasSize) * box,
};
let score = 0;
let gameSpeed;
let game;

const bgMusic = new Audio("background.mp3");
bgMusic.loop = true;

function showGameOverMessage() {
    console.log("Juego terminado. Mostrando mensaje.");
    let message = document.getElementById("gameOverMessage");
    if (!message) {
        message = document.createElement("div");
        message.id = "gameOverMessage";
        document.body.appendChild(message);
    }

    message.innerHTML = `
        <h2>¡Juego terminado!</h2>
        <p>Puntuación: ${score}</p>
        <button id="restartGame">Reiniciar</button>
    `;
    message.style.display = "block";

    document.getElementById("restartGame").addEventListener("click", () => {
        message.style.display = "none";
        startGame();
    });

    bgMusic.pause();
    bgMusic.currentTime = 0;
}

function draw() {
    console.log("Dibujando...");
    if (bgImage.complete) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "lightgreen";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    for (let segment of snake) {
        ctx.fillStyle = "darkgreen";
        ctx.fillRect(segment.x, segment.y, box, box);
    }

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;

    if (headX === food.x && headY === food.y) {
        score++;
        console.log("Comida recogida. Puntuación:", score);
        food = {
            x: Math.floor(Math.random() * canvasSize) * box,
            y: Math.floor(Math.random() * canvasSize) * box,
        };
    } else {
        snake.pop();
    }

    const newHead = { x: headX, y: headY };

    if (
        headX < 0 ||
        headY < 0 ||
        headX >= canvas.width ||
        headY >= canvas.height ||
        snake.some(segment => segment.x === headX && segment.y === headY)
    ) {
        clearInterval(game);
        showGameOverMessage();
        return;
    }

    snake.unshift(newHead);
}

function startGame() {
    console.log("Iniciando juego...");
    const difficulty = document.getElementById("difficulty");
    if (!difficulty) {
        console.error("Selector de dificultad no encontrado.");
        return;
    }
    gameSpeed = parseInt(difficulty.value);

    if (game) clearInterval(game);
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    score = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game = setInterval(draw, gameSpeed);
    console.log("Juego iniciado con velocidad:", gameSpeed);
}

const bgImage = new Image();
bgImage.src = "background.png";
bgImage.onload = () => console.log("Imagen de fondo cargada correctamente.");
bgImage.onerror = () => console.error("Error al cargar la imagen de fondo.");

document.addEventListener("keydown", event => {
    event.preventDefault(); // Evitar conflictos con el navegador
    console.log("Tecla presionada:", event.key);
    switch (event.key) {
        case "ArrowUp":
            if (direction !== "DOWN") direction = "UP";
            break;
        case "ArrowDown":
            if (direction !== "UP") direction = "DOWN";
            break;
        case "ArrowLeft":
            if (direction !== "RIGHT") direction = "LEFT";
            break;
        case "ArrowRight":
            if (direction !== "LEFT") direction = "RIGHT";
            break;
        default:
            break;
    }
});

document.getElementById("startGame").addEventListener("click", () => {
    bgMusic.play().catch(error => console.error("No se puede reproducir la música:", error));
    startGame();
});
