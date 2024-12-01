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
let gameSpeed;
let game;

// Crear mensaje de fin de juego
function showGameOverMessage() {
    // Verificar si el mensaje ya existe
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

    // Manejar el botón de reinicio
    document.getElementById("restartGame").addEventListener("click", () => {
        message.style.display = "none"; // Ocultar el mensaje
        startGame(); // Reiniciar el juego
    });
}

// Control del movimiento
document.addEventListener("keydown", event => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Función para dibujar la culebra y la comida
function draw() {
    // Fondo
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar la comida
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Dibujar la serpiente
    for (let segment of snake) {
        ctx.fillStyle = "darkgreen";
        ctx.fillRect(segment.x, segment.y, box, box);
    }

    // Posición de la cabeza
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "UP") headY -= box;
    if (direction === "DOWN") headY += box;
    if (direction === "LEFT") headX -= box;
    if (direction === "RIGHT") headX += box;

    // Comprobar si la serpiente come la comida
    if (headX === food.x && headY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * canvasSize) * box,
            y: Math.floor(Math.random() * canvasSize) * box,
        };
    } else {
        snake.pop(); // Quitar la cola si no come
    }

    // Nueva cabeza
    const newHead = { x: headX, y: headY };

    // Fin del juego si la serpiente choca con el borde o consigo misma
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

    snake.unshift(newHead); // Agregar la nueva cabeza
}

// Función para iniciar el juego
function startGame() {
    // Configurar la velocidad del juego según la dificultad seleccionada
    const difficulty = document.getElementById("difficulty");
    gameSpeed = parseInt(difficulty.value);

    // Detener el intervalo previo, si existe
    if (game) {
        clearInterval(game);
    }

    // Reiniciar el estado del juego
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    score = 0;

    // Limpiar el canvas antes de iniciar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Iniciar el juego
    game = setInterval(draw, gameSpeed);
}

// Botón de inicio
document.getElementById("startGame").addEventListener("click", startGame);
