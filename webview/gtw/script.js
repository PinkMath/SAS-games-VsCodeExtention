// Expanded word lists
const words = {
    EN: [
        "APPLE","HOUSE","PLANT","BRAVE","LIGHT","WORLD","NIGHT","WATER","MONEY","SMART",
        "TRAIN","FRUIT","GREEN","STORM","SOUND","BREAD","CHAIR","DRINK","SWEET","TABLE",
        "HEART","RIVER","CLOUD","STONE","MUSIC","PARTY","FIGHT","EARTH","PLANE","SHEEP",
        "GRASS","BRICK","SMILE","LAUGH","DREAM","SLEEP","POWER","SHINE","FLAME","GLASS",
        "CROWN","SWORD","QUEST","MAGIC","OCEAN","BEACH","SHELL","WHEEL","TRACK","SPEED",
        "SCORE","LEVEL","MATCH","GUESS","WORDS","INPUT","CLICK","PRESS","START","RESET"
    ],

    PT: [
        "CASAS","LIVRO","PLANO","FORTE","LUZES","MUNDO","NOITE","AGUAS","SABER","FALAR",
        "TRENO","FRUTA","VERDE","TEMPO","SONHO","PAOES","CADEI","BEBER","DOCES","MESAS",
        "CORAC","RIOES","NUVEM","PEDRA","MUSCA","FESTA","LUTAR","TERRA","PRAIA","AREIA",
        "MARTE","VENUS","PLUTO","ESTRE","BRISA","VENTO","CHUVA","NEVAR","GELO","CALOR",
        "AMIGO","AMIGA","FAMIL","FILHO","FILHA","JOGAR","GANHO","PERDA","NIVEL","PONTO",
        "DADOS","TEXTO","LETRA","PALAV","DIGIT","CLICA","BOTAO","INICI","RESET"
    ]
};

let language = "EN";
let answer = "";
let currentRow = 0;
let currentCol = 0;
let gameOver = false;

// DOM Elements
const board = document.getElementById("game-board");
const message = document.getElementById("message");
const langSelector = document.getElementById("lang");
const resetBtn = document.getElementById("reset-btn");

// Initialize board
function initBoard() {
    board.innerHTML = "";
    currentRow = 0;
    currentCol = 0;
    gameOver = false;
    message.textContent = "";
    resetBtn.style.display = "none";
    answer = words[language][Math.floor(Math.random() * words[language].length)];

    const rows = 6;
    const cols = answer.length; 

    board.style.gridTemplateColumns = `repeat(${cols}, 90px)`;  

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute("id", `cell-${i}-${j}`);
            board.appendChild(cell);
        }
    }
    updateFocus();
}

// Update focus class on current cell
function updateFocus() {
    document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("focus"));
    if (!gameOver) {
        const currentCell = document.getElementById(`cell-${currentRow}-${currentCol}`);
        if (currentCell) currentCell.classList.add("focus");
    }
}

// Handle key input
document.addEventListener("keydown", (e) => {
    if (gameOver) return;
    const cols = answer.length;

    if (e.key === "Backspace") {
        if (currentCol > 0) {
            currentCol--;
            document.getElementById(`cell-${currentRow}-${currentCol}`).textContent = "";
            updateFocus();
        }
    } else if (e.key === "Enter") {
        if (currentCol === cols) submitGuess();
    } else if (/^[a-zA-Z]$/.test(e.key)) {
        if (currentCol < cols) {
            document.getElementById(`cell-${currentRow}-${currentCol}`).textContent = e.key.toUpperCase();
            currentCol++;
            updateFocus();
        }
    }
});

// Submit guess with flip animation
function submitGuess() {
    const guess = [];
    const cols = answer.length;
    for (let i = 0; i < cols; i++) {
        guess.push(document.getElementById(`cell-${currentRow}-${i}`).textContent);
    }
    const guessStr = guess.join("");
    if (guessStr.length !== cols) return;

    for (let i = 0; i < cols; i++) {
        const cell = document.getElementById(`cell-${currentRow}-${i}`);
        setTimeout(() => {
            cell.classList.add("flip");
            setTimeout(() => {
                if (guess[i] === answer[i]) cell.classList.add("correct");
                else if (answer.includes(guess[i])) cell.classList.add("present");
                else cell.classList.add("absent");
                cell.classList.remove("flip");
            }, 150);
        }, i * 200);
    }

    setTimeout(() => {
        if (guessStr === answer) {
            message.textContent = language === "EN" ? "🎉 You guessed it!" : "🎉 Você acertou!";
            endGame();
        } else if (currentRow === 5) {
            message.textContent = language === "EN" ? `Game over! The word was ${answer}` : `Fim de jogo! A palavra era ${answer}`;
            endGame();
        } else {
            currentRow++;
            currentCol = 0;
            updateFocus();
        }
    }, cols * 200 + 200);
}

// End game
function endGame() {
    gameOver = true;
    resetBtn.style.display = "inline-block";
}

// Reset button
resetBtn.addEventListener("click", () => {
    initBoard();
});

// Language change
langSelector.addEventListener("change", (e) => {
    language = e.target.value;
    initBoard();
});

function createStars(numStars = 150) {
    const container = document.getElementById("star-container");
    container.innerHTML = ""; 
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < numStars; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        star.style.top = `${Math.random() * height}px`;
        star.style.left = `${Math.random() * width}px`;

        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        star.style.animationDelay = `${Math.random() * 5}s`;

        container.appendChild(star);
    }
}

// Create stars once and update on resize
createStars();
window.addEventListener("resize", () => {
    createStars();
});

// Start game
initBoard();