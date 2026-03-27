const vscode = acquireVsCodeApi();

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const grid = 20, size = 20;

let snake, dir, food, bonusFood, score, running, particles = [];
const scoreEl = document.getElementById('score');
const highEl = document.getElementById('high');
const overlay = document.getElementById('overlay');

const skins = {
  classic: { head: "#4ade80", body: "#22c55e", food: "#ef4444" },
  neon: { head: "#00ffff", body: "#00ffcc", food: "#ff00ff" },
  fire: { head: "#f97316", body: "#ef4444", food: "#fde047" },
  purple: { head: "#c084fc", body: "#a855f7", food: "#f472b6" },
  rainbow: { head: "#ffffff", body: "rainbow", food: "#ffffff" }
};

let currentSkin = localStorage.getItem('snakeSkin') || 'classic';
let highScore = localStorage.getItem('snakeHigh') || 0;
highEl.textContent = highScore;

const eatSound = new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg');
const dieSound = new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg');

let audioUnlocked = false;
function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  eatSound.play().then(() => eatSound.pause()).catch(() => {});
  dieSound.play().then(() => dieSound.pause()).catch(() => {});
}
window.addEventListener('click', unlockAudio, { once: true });
window.addEventListener('keydown', unlockAudio, { once: true });

function playEatSound() {
  if (audioUnlocked) eatSound.play().catch(() => {});
}

function playDieSound() {
  if (audioUnlocked) dieSound.play().catch(() => {});
}

// --------- GAME FUNCTIONS ---------

function startGame() {
  snake = [{x:10, y:10}];
  dir = {x:1, y:0};
  food = spawnFood();
  bonusFood = null;
  score = 0;
  running = true;
  particles = [];
  scoreEl.textContent = score;
  overlay.innerHTML = '';
  requestAnimationFrame(loop);
}

function spawnFood() {
  return {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
}

function spawnParticles(x, y, color) {
  for (let i = 0; i < 10; i++) {
    particles.push({
      x, y,
      dx: (Math.random() - 0.5) * 4,
      dy: (Math.random() - 0.5) * 4,
      life: 20,
      color
    });
  }
}

// --------- INPUT ---------

document.addEventListener('keydown', e => {
  if (!running && (e.key === 'Enter' || e.key === 'Return')) startGame();

  // Prevent opposite moves
  switch(e.key) {
    // Up
    case 'ArrowUp':
    case 'w':
    case 'W':
      if (dir.y !== 1) dir = {x:0, y:-1};
      break;

    // Down
    case 'ArrowDown':
    case 's':
    case 'S':
      if (dir.y !== -1) dir = {x:0, y:1};
      break;

    // Left
    case 'ArrowLeft':
    case 'a':
    case 'A':
      if (dir.x !== 1) dir = {x:-1, y:0};
      break;

    // Right
    case 'ArrowRight':
    case 'd':
    case 'D':
      if (dir.x !== -1) dir = {x:1, y:0};
      break;

    // Close popup
    case 'Escape':
      vscode.postMessage('close');
      break;
  }
});

let lastMove = 0, speed = 80;

// --------- GAME LOOP ---------

function loop(time) {
  if (!running) return;
  if (time - lastMove > speed) { update(); lastMove = time; }
  draw();
  requestAnimationFrame(loop);
}

function update() {
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  if (
    head.x < 0 || head.y < 0 || head.x >= 20 || head.y >= 20 ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    playDieSound();
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    playEatSound();
    spawnParticles(head.x, head.y, skins[currentSkin].body);
    score++;
    scoreEl.textContent = score;
    food = spawnFood();
    if (Math.random() < 0.3) bonusFood = spawnFood();
  } else if (bonusFood && head.x === bonusFood.x && head.y === bonusFood.y) {
    playEatSound();
    spawnParticles(head.x, head.y, "gold");
    score += 5;
    scoreEl.textContent = score;
    bonusFood = null;
  } else {
    snake.pop();
  }
}

// --------- DRAW ---------

function draw() {
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#0f172a";
  for (let i = 0; i < 20; i++) {
    ctx.beginPath(); ctx.moveTo(i*grid, 0); ctx.lineTo(i*grid, 400); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i*grid); ctx.lineTo(400, i*grid); ctx.stroke();
  }

  drawSquare(food, skins[currentSkin].food);
  if (bonusFood) drawSquare(bonusFood, "gold");

  snake.forEach((s, i) => {
    let bodyColor;

    if (i === 0) {
      bodyColor = skins[currentSkin].head;
    } else if (skins[currentSkin].body === "rainbow") {
      let t = Date.now() / 200;
      bodyColor = `hsl(${(t*40 + i*20)%360}, 100%, 50%)`;
    } else {
      bodyColor = skins[currentSkin].body;
    }

    ctx.fillStyle = bodyColor;
    ctx.shadowColor = bodyColor;
    ctx.shadowBlur = 10;
    ctx.fillRect(s.x*grid, s.y*grid, size-2, size-2);
    ctx.shadowBlur = 0;

    if (i === 0) {
      ctx.fillStyle = "black";
      ctx.fillRect(s.x*grid+4, s.y*grid+4, 3,3);
      ctx.fillRect(s.x*grid+12, s.y*grid+4, 3,3);
    }
  });

  particles.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x*grid, p.y*grid, 4, 4);
    p.x += p.dx * 0.1;
    p.y += p.dy * 0.1;
    p.life--;
  });
  particles = particles.filter(p => p.life > 0);
}

function drawSquare(pos, color) {
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 15;
  ctx.fillRect(pos.x*grid, pos.y*grid, size-2, size-2);
  ctx.shadowBlur = 0;
}

// --------- GAME OVER & SKINS ---------

function gameOver() {
  running = false;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('snakeHigh', highScore);
    highEl.textContent = highScore;
  }

  overlay.innerHTML = `
    <h2>Game Over</h2>
    <div>Score: ${score}</div>
    <div style="margin-top:6px;">
      <button onclick="startGame()">Restart</button>
      <button onclick="renderMenu()">Skins</button>
    </div>
    <div style="font-size:12px;opacity:0.7;margin-top:6px;">Press ENTER to restart</div>
  `;
}

function renderMenu() {
  overlay.innerHTML = `
    <h2>Snake 🐍</h2>
    <div>Select Skin:</div>
    <div id="skins"></div>
    <button onclick="startGame()">Start</button>
  `;

  const skinsDiv = document.getElementById('skins');
  skinsDiv.innerHTML = Object.keys(skins).map(name => `
    <button onclick="selectSkin('${name}')"
      style="background:${skins[name].body==='rainbow'?'#fff':skins[name].body};
             border:${currentSkin===name?'2px solid white':'none'}">${name}</button>
  `).join('');
}

function selectSkin(name) {
  currentSkin = name;
  localStorage.setItem('snakeSkin', name);
  renderMenu();
}

// --------- INIT ---------

renderMenu();