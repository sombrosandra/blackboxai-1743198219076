const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Set canvas size to match window
function resizeCanvas() {
    const size = Math.min(window.innerWidth - 40, window.innerHeight - 200);
    canvas.width = size;
    canvas.height = size;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game variables
const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = generateFood();
let direction = 'right';
let nextDirection = 'right';
let gameSpeed = 150;
let score = 0;
let gameRunning = true;

// Generate random food position
function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
}

// Main game loop
function gameLoop() {
    if (!gameRunning) return;
    
    setTimeout(() => {
        moveSnake();
        checkCollision();
        drawGame();
        gameLoop();
    }, gameSpeed);
}

// Move the snake
function moveSnake() {
    direction = nextDirection;
    const head = {x: snake[0].x, y: snake[0].y};
    
    switch(direction) {
        case 'up': head.y -= 1; break;
        case 'down': head.y += 1; break;
        case 'left': head.x -= 1; break;
        case 'right': head.x += 1; break;
    }
    
    snake.unshift(head);
    
    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        food = generateFood();
        // Vibrate on food collection if supported
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
        // Increase speed every 50 points
        if (score % 50 === 0 && gameSpeed > 50) {
            gameSpeed -= 10;
        }
    } else {
        snake.pop();
    }
}

// Check for collisions
function checkCollision() {
    const head = snake[0];
    
    // Wall collision
    if (head.x < 0 || head.x >= canvas.width/gridSize || 
        head.y < 0 || head.y >= canvas.height/gridSize) {
        gameOver();
    }
    
    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
}

// Draw game elements
function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#4CAF50' : '#2E7D32';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        ctx.strokeStyle = '#1B5E20';
        ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
    
    // Draw food
    ctx.fillStyle = '#FF5252';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize/2, 
        food.y * gridSize + gridSize/2, 
        gridSize/2, 0, Math.PI * 2
    );
    ctx.fill();
}

// Game over
function gameOver() {
    gameRunning = false;
    alert(`Game Over! Your score: ${score}\nPress OK to restart`);
    resetGame();
}

// Reset game
function resetGame() {
    snake = [{x: 10, y: 10}];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    scoreElement.textContent = score;
    gameSpeed = 150;
    food = generateFood();
    gameRunning = true;
    gameLoop();
}

// Keyboard controls
document.addEventListener('keydown', e => {
    switch(e.key) {
        case 'ArrowUp': if (direction !== 'down') nextDirection = 'up'; break;
        case 'ArrowDown': if (direction !== 'up') nextDirection = 'down'; break;
        case 'ArrowLeft': if (direction !== 'right') nextDirection = 'left'; break;
        case 'ArrowRight': if (direction !== 'left') nextDirection = 'right'; break;
    }
});

// Touch controls
document.getElementById('upBtn').addEventListener('click', () => {
    if (direction !== 'down') nextDirection = 'up';
});
document.getElementById('downBtn').addEventListener('click', () => {
    if (direction !== 'up') nextDirection = 'down';
});
document.getElementById('leftBtn').addEventListener('click', () => {
    if (direction !== 'right') nextDirection = 'left';
});
document.getElementById('rightBtn').addEventListener('click', () => {
    if (direction !== 'left') nextDirection = 'right';
});

// Start the game
gameLoop();