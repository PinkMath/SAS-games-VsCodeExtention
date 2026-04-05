const board = document.getElementById("game-board");
const flagsDisplay = document.getElementById("flags");
const restartBtn = document.getElementById("restart-btn");
const winScreen = document.getElementById("win-screen");
const winRestartBtn = document.getElementById("win-restart-btn");
const modeSelect = document.getElementById("mode-select");

let SIZE = 6;
let MINES = 6;

let cells = [];
let flags = 0;
let revealedCount = 0;
let minesPlaced = false; // track if mines are placed yet

// Set mode
function setMode(mode) {
  if (mode === "easy") { SIZE = 5; MINES = 5; }
  else if (mode === "normal") { SIZE = 6; MINES = 6; }
  else if (mode === "hard") { SIZE = 8; MINES = 12; }
}

// Initialize game
function initGame() {
  setMode(modeSelect.value);
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${SIZE}, 50px)`;
  winScreen.classList.add("hidden");
  cells = [];
  flags = 0;
  revealedCount = 0;
  minesPlaced = false;
  flagsDisplay.textContent = "Flags: 0";

  // Create grid
  for (let y = 0; y < SIZE; y++) {
    cells[y] = [];
    for (let x = 0; x < SIZE; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.dataset.mine = "false";
      cell.dataset.revealed = "false";
      cell.dataset.flagged = "false";
      cell.addEventListener("click", handleFirstClick);
      cell.addEventListener("contextmenu", toggleFlag);
      board.appendChild(cell);
      cells[y][x] = cell;
    }
  }
}

// Place mines avoiding first clicked cell and neighbors
function placeMinesAvoiding(xAvoid, yAvoid) {
  let placed = 0;
  while (placed < MINES) {
    const x = Math.floor(Math.random() * SIZE);
    const y = Math.floor(Math.random() * SIZE);

    if (cells[y][x].dataset.mine === "false") {
      // Skip if this cell is first clicked cell or neighbor
      if (Math.abs(x - xAvoid) <= 1 && Math.abs(y - yAvoid) <= 1) continue;
      cells[y][x].dataset.mine = "true";
      placed++;
    }
  }
}

// Handle the first click specially
function handleFirstClick(e) {
  const cell = e.currentTarget;
  if (cell.dataset.flagged === "true") return; // ignore flagged

  if (!minesPlaced) {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    placeMinesAvoiding(x, y);
    minesPlaced = true;
    // Replace click handler with normal reveal for all cells
    for (let row of cells) {
      for (let c of row) {
        c.removeEventListener("click", handleFirstClick);
        c.addEventListener("click", revealCell);
      }
    }
  }
  revealCell(e);
}

// Reveal a cell
function revealCell(e) {
  const cell = e.currentTarget;
  if (cell.dataset.revealed === "true" || cell.dataset.flagged === "true") return;

  cell.dataset.revealed = "true";
  cell.classList.add("revealed");

  if (cell.dataset.mine === "true") {
    cell.textContent = "💣";
    cell.classList.add("boom");

    // Disable all clicks while animation runs
    for (let row of cells) {
      for (let c of row) {
        c.removeEventListener("click", revealCell);
        c.removeEventListener("click", handleFirstClick);
        c.removeEventListener("contextmenu", toggleFlag);
      }
    }

    // After animation ends, alert and restart game
    cell.addEventListener(
      "animationend",
      () => {
        alert("Game Over!");
        initGame();
      },
      { once: true }
    );

    return;
  }

  revealedCount++;
  const minesAround = countMines(cell);
  if (minesAround > 0) cell.textContent = minesAround;
  else revealNeighbors(cell);

  checkWin();
}

// Reveal neighbors recursively if empty
function revealNeighbors(cell) {
  const x = parseInt(cell.dataset.x);
  const y = parseInt(cell.dataset.y);
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < SIZE && ny < SIZE) {
        const neighbor = cells[ny][nx];
        if (neighbor.dataset.revealed === "false" && neighbor.dataset.flagged === "false") {
          neighbor.dataset.revealed = "true";
          neighbor.classList.add("revealed");
          revealedCount++;
          const minesAround = countMines(neighbor);
          if (minesAround > 0) neighbor.textContent = minesAround;
          else revealNeighbors(neighbor);
        }
      }
    }
  }
}

// Count mines around a cell
function countMines(cell) {
  let x = parseInt(cell.dataset.x);
  let y = parseInt(cell.dataset.y);
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < SIZE && ny < SIZE) {
        if (cells[ny][nx].dataset.mine === "true") count++;
      }
    }
  }
  return count;
}

// Toggle flag on right-click
function toggleFlag(e) {
  e.preventDefault();
  const cell = e.currentTarget;
  if (cell.dataset.revealed === "true") return;

  if (cell.dataset.flagged === "true") {
    cell.dataset.flagged = "false";
    cell.classList.remove("flagged");
    cell.textContent = "";
    flags--;
  } else {
    cell.dataset.flagged = "true";
    cell.classList.add("flagged");
    cell.textContent = "🚩";
    flags++;
  }
  flagsDisplay.textContent = `Flags: ${flags}`;
}

// Check win condition
function checkWin() {
  if (revealedCount === SIZE*SIZE - MINES) {
    winScreen.classList.remove("hidden");
  }
}

// Event listeners
restartBtn.addEventListener("click", initGame);
winRestartBtn.addEventListener("click", initGame);
modeSelect.addEventListener("change", initGame);

// Start game
initGame();