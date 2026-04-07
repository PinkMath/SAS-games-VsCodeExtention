const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const score1El = document.getElementById("score1");
const score2El = document.getElementById("score2");
const restartBtn = document.getElementById("restart");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle properties
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const PADDLE_SPEED = 6;

// Ball properties
const BALL_SIZE = 12;
const BALL_SPEED = 5;

let player1 = { x: 0, y: HEIGHT / 2 - PADDLE_HEIGHT / 2, dy: 0, score: 0 };
let player2 = { x: WIDTH - PADDLE_WIDTH, y: HEIGHT / 2 - PADDLE_HEIGHT / 2, dy: 0, score: 0 };

let ball = {
  x: WIDTH / 2 - BALL_SIZE / 2,
  y: HEIGHT / 2 - BALL_SIZE / 2,
  dx: BALL_SPEED,
  dy: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1)
};

let keys = {};

// Draw everything
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawNet() {
  const netWidth = 4;
  const netHeight = 20;
  const netColor = "#9ca3af";

  for (let i = 0; i < HEIGHT; i += netHeight + 10) {
    drawRect(WIDTH / 2 - netWidth / 2, i, netWidth, netHeight, netColor);
  }
}

function draw() {
  // Clear canvas
  drawRect(0, 0, WIDTH, HEIGHT, "#374151");

  // Draw net
  drawNet();

  // Draw paddles
  drawRect(player1.x, player1.y, PADDLE_WIDTH, PADDLE_HEIGHT, "#fbbf24");
  drawRect(player2.x, player2.y, PADDLE_WIDTH, PADDLE_HEIGHT, "#fbbf24");

  // Draw ball
  drawCircle(ball.x + BALL_SIZE / 2, ball.y + BALL_SIZE / 2, BALL_SIZE / 2, "#fbbf24");
}

// Update positions
function update() {
  // Move paddles
  player1.y += player1.dy;
  player2.y += player2.dy;

  // Keep paddles inside canvas
  if (player1.y < 0) player1.y = 0;
  if (player1.y + PADDLE_HEIGHT > HEIGHT) player1.y = HEIGHT - PADDLE_HEIGHT;
  if (player2.y < 0) player2.y = 0;
  if (player2.y + PADDLE_HEIGHT > HEIGHT) player2.y = HEIGHT - PADDLE_HEIGHT;

  // Move ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball collision with top and bottom
  if (ball.y < 0 || ball.y + BALL_SIZE > HEIGHT) {
    ball.dy = -ball.dy;
  }

  // Ball collision with paddles
  if (
    ball.x < player1.x + PADDLE_WIDTH &&
    ball.x > player1.x &&
    ball.y + BALL_SIZE > player1.y &&
    ball.y < player1.y + PADDLE_HEIGHT
  ) {
    ball.dx = -ball.dx;

    // Slightly change dy depending on where ball hit paddle
    let hitPos = (ball.y + BALL_SIZE / 2) - (player1.y + PADDLE_HEIGHT / 2);
    ball.dy = hitPos * 0.2;
  }

  if (
    ball.x + BALL_SIZE > player2.x &&
    ball.x + BALL_SIZE < player2.x + PADDLE_WIDTH &&
    ball.y + BALL_SIZE > player2.y &&
    ball.y < player2.y + PADDLE_HEIGHT
  ) {
    ball.dx = -ball.dx;

    let hitPos = (ball.y + BALL_SIZE / 2) - (player2.y + PADDLE_HEIGHT / 2);
    ball.dy = hitPos * 0.2;
  }

  // Check for scoring
  if (ball.x < 0) {
    player2.score++;
    resetBall();
    updateScore();
  }
  else if (ball.x + BALL_SIZE > WIDTH) {
    player1.score++;
    resetBall();
    updateScore();
  }
}

// Reset ball to center with random direction
function resetBall() {
  ball.x = WIDTH / 2 - BALL_SIZE / 2;
  ball.y = HEIGHT / 2 - BALL_SIZE / 2;
  ball.dx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  ball.dy = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
}

// Update score display
function updateScore() {
  score1El.textContent = player1.score;
  score2El.textContent = player2.score;
}

// Game loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Keyboard controls
window.addEventListener("keydown", e => {
  switch (e.key) {
    case "w":
    case "W":
      player1.dy = -PADDLE_SPEED;
      break;
    case "s":
    case "S":
      player1.dy = PADDLE_SPEED;
      break;
    case "ArrowUp":
      player2.dy = -PADDLE_SPEED;
      break;
    case "ArrowDown":
      player2.dy = PADDLE_SPEED;
      break;
  }
});

window.addEventListener("keyup", e => {
  switch (e.key) {
    case "w":
    case "W":
      if (player1.dy < 0) player1.dy = 0;
      break;
    case "s":
    case "S":
      if (player1.dy > 0) player1.dy = 0;
      break;
    case "ArrowUp":
      if (player2.dy < 0) player2.dy = 0;
      break;
    case "ArrowDown":
      if (player2.dy > 0) player2.dy = 0;
      break;
  }
});

restartBtn.addEventListener("click", () => {
  player1.score = 0;
  player2.score = 0;
  updateScore();
  resetBall();
});

updateScore();
loop();