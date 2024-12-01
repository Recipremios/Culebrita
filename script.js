const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20; // Tamaño de cada cuadro
const canvasSize = 20; // Tamaño en cuadros

let snake = [{ x: 10 * box, y: 10 * box }]; // Posición inicial
let direction = "RIGHT"; // Dirección inicial
let food = {
    x: Math.floor(Math.random() * canvasSize) * box,
    y: Math.floor(Math.random() * canvasSize) * box,
};
let score = 0;
let level = 1;
let gameSpeed;
let game;

const bgMusic = new Audio("background.mp3");
bgMusic.loop = true;

// Mostrar mensaje de fin del juego
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

// Dibujar el juego
function draw() {
    console.log("Dibujando...");
    if (bgImage.complete) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "lightgreen";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Dibujar comida
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Dibujar la serpiente
    for (let segment of snake) {
        ctx.fillStyle = "darkgreen";
        ctx.fillRect(segment.x, segment.y, box, box);
    }

    // Calcular nueva posición de la cabeza
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;

    // Comprobar si la serpiente come la comida
    if (headX === food.x && headY === food.y) {
        score++;
        console.log("Comida recogida. Puntuación:", score);

        const scoreDisplay = document.getElementById("scoreDisplay");
        scoreDisplay.textContent = `Puntaje: ${score}`;

        // Incrementar nivel cada 5 puntos
        if (score % 5 === 0) {
            level++;
            console.log("Nivel alcanzado:", level);

            const levelDisplay = document.getElementById("levelDisplay");
            levelDisplay.textContent = `Nivel: ${level}`;

            // Aumentar la velocidad del juego
            clearInterval(game);
            gameSpeed = Math.max(50, gameSpeed - 20); // Reducir el intervalo hasta un mínimo de 50ms
            game = setInterval(draw, gameSpeed);
        }

        food = {
            x: Math.floor(Math.random() * canvasSize) * box,
            y: Math.floor(Math.random() * canvasSize) * box,
        };
    } else {
        snake.pop();
    }

    const newHead = { x: headX, y: headY };

    // Comprobar colisiones
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

// Iniciar el juego
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
    level = 1;

    const scoreDisplay = document.getElementById("scoreDisplay");
    scoreDisplay.textContent = "Puntaje: 0";

    const levelDisplay = document.getElementById("levelDisplay");
    levelDisplay.textContent = "Nivel: 1";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game = setInterval(draw, gameSpeed);
    console.log("Juego iniciado con velocidad:", gameSpeed);
}

// Cargar la imagen de fondo
const bgImage = new Image();
bgImage.src = "background.png";
bgImage.onload = () => console.log("Imagen de fondo cargada correctamente.");
bgImage.onerror = () => console.error("Error al cargar la imagen de fondo.");

// Detectar teclas para el movimiento
document.addEventListener("keydown", event => {
    event.preventDefault();
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

// Iniciar el juego con el botón
document.getElementById("startGame").addEventListener("click", () => {
    bgMusic.play().catch(error => console.error("No se puede reproducir la música:", error));
    startGame();
});
