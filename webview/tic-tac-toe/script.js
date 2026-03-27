const vscode = acquireVsCodeApi();

const boardEl = document.getElementById('board');
const infoEl = document.getElementById('info');
const overlay = document.getElementById('overlay');
const restartBtn = document.getElementById('restart');

let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

let currentPlayer = 'X';
let gameOver = false;
let mode = null; // 'easy', 'normal', 'hard', '1v1'

// Draw the board, lastMove = [row,col] for animation
function drawBoard(lastMove) {
  boardEl.innerHTML = '';
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.textContent = board[r][c];

      // Animate only the last move
      if (lastMove && lastMove[0] === r && lastMove[1] === c) {
        cell.classList.add('pop');
      }

      boardEl.appendChild(cell);
    }
  }

  if (!gameOver) {
    infoEl.style.opacity = 0;
    setTimeout(() => {
      infoEl.textContent = `${currentPlayer}'s Turn`;
      infoEl.style.opacity = 1;
    }, 100);
  }
}

// Highlight winning line
function highlightWinningLine(line) {
  line.forEach(([r, c]) => {
    const cell = document.querySelector(`.cell[data-row='${r}'][data-col='${c}']`);
    if (cell) cell.classList.add('winning-cell');
  });
}

// Check winner or draw
function checkWinner() {
  const lines = [
    [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],
    [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]],
    [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]]
  ];

  for (const line of lines) {
    const [a,b,c] = line;
    if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
      gameOver = true;
      highlightWinningLine(line);
      infoEl.textContent = mode === '1v1' ? `Player ${board[a[0]][a[1]]} Wins! 🎉` : `${board[a[0]][a[1]]} Wins! 🎉`;
      restartBtn.style.display = 'inline-block';
      changeModeBtn.style.display = 'inline-block';
      return true;
    }
  }

  if (board.flat().every(cell => cell !== '')) {
    gameOver = true;
    infoEl.textContent = 'Draw! 🤝';
    restartBtn.style.display = 'inline-block';
    changeModeBtn.style.display = 'inline-block';
    return true;
  }

  return false;
}

// AI moves
function aiMoveEasy() {
  if (gameOver) return;
  const emptyCells = [];
  for (let r=0; r<3; r++) for (let c=0; c<3; c++) if (board[r][c]==='') emptyCells.push([r,c]);
  if (emptyCells.length===0) return;
  const move = emptyCells[Math.floor(Math.random()*emptyCells.length)];
  board[move[0]][move[1]] = currentPlayer;
  animateAIMove(move[0], move[1]);
}

function aiMoveNormal() { aiMoveEasy(); }

function winning(bd, player) {
  const lines = [
    [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],
    [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]],
    [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]]
  ];
  return lines.some(line => line.every(([r,c]) => bd[r][c]===player));
}

function minimax(newBoard, player){
  const avail=[];
  for(let r=0;r<3;r++) for(let c=0;c<3;c++) if(newBoard[r][c]==='') avail.push([r,c]);
  if(winning(newBoard,'X')) return {score:-10};
  if(winning(newBoard,'O')) return {score:10};
  if(avail.length===0) return {score:0};

  const moves=[];
  for(const spot of avail){
    const move={pos:spot};
    newBoard[spot[0]][spot[1]]=player;
    move.score=player==='O'?minimax(newBoard,'X').score:minimax(newBoard,'O').score;
    newBoard[spot[0]][spot[1]]='';
    moves.push(move);
  }

  let bestMove;
  if(player==='O'){
    let bestScore=-Infinity;
    for(const m of moves) if(m.score>bestScore){bestScore=m.score;bestMove=m;}
  } else {
    let bestScore=Infinity;
    for(const m of moves) if(m.score<bestScore){bestScore=m.score;bestMove=m;}
  }
  return bestMove;
}

function aiMoveHard() {
  if(gameOver) return;
  const bestMove = minimax(board.map(r=>r.slice()), currentPlayer);
  if(bestMove && bestMove.pos) board[bestMove.pos[0]][bestMove.pos[1]] = currentPlayer;
  animateAIMove(bestMove.pos[0], bestMove.pos[1]);
}

// Animate AI move
function animateAIMove(r,c){
  drawBoard([r,c]); // animate last move
  setTimeout(()=>{
    checkWinner();
    if(!gameOver){
      currentPlayer = currentPlayer==='X'?'O':'X';
      drawBoard();
    }
  },200);
}

function aiMove(){
  if(gameOver) return;
  if(mode==='easy') aiMoveEasy();
  else if(mode==='normal') aiMoveNormal();
  else if(mode==='hard') aiMoveHard();
}

// Player clicks
boardEl.addEventListener('click', e=>{
  if(gameOver) return;
  if(!e.target.classList.contains('cell')) return;
  const row=parseInt(e.target.dataset.row);
  const col=parseInt(e.target.dataset.col);
  if(board[row][col]!=='') return;

  board[row][col]=currentPlayer;
  drawBoard([row,col]);

  if(!checkWinner()){
    currentPlayer=currentPlayer==='X'?'O':'X';
    drawBoard();
    if(mode!=='1v1') setTimeout(aiMove,250);
  } else {
    restartBtn.style.display='inline-block';
    changeModeBtn.style.display='inline-block';
  }
});

// Reset game
function resetGame(){
  board=[['','',''],['','',''],['','','']];
  currentPlayer='X';
  gameOver=false;
  infoEl.textContent=`${currentPlayer}'s Turn`;
  restartBtn.style.display='none';
  changeModeBtn.style.display='none';
  drawBoard();
}

// Mode selection
function renderModeMenu(){
  overlay.innerHTML=`
    <h2>Select Game Mode</h2>
    <div>
      <button id="easy-btn">Easy</button>
      <button id="normal-btn">Normal</button>
      <button id="hard-btn">Hard</button>
      <button id="1v1-btn">1v1 (Play with Friend)</button>
    </div>
  `;
  overlay.style.display='flex';
  document.getElementById('easy-btn').onclick=()=>selectMode('easy');
  document.getElementById('normal-btn').onclick=()=>selectMode('normal');
  document.getElementById('hard-btn').onclick=()=>selectMode('hard');
  document.getElementById('1v1-btn').onclick=()=>selectMode('1v1');
}

function selectMode(selected){
  mode=selected;
  overlay.style.display='none';
  resetGame();
}

// Change mode button
const changeModeBtn=document.createElement('button');
changeModeBtn.textContent='Change Mode';
changeModeBtn.style.display='none';
changeModeBtn.style.marginTop='10px';
changeModeBtn.style.padding='8px 24px';
changeModeBtn.style.fontSize='1rem';
changeModeBtn.style.borderRadius='8px';
changeModeBtn.style.border='none';
changeModeBtn.style.cursor='pointer';
changeModeBtn.style.backgroundColor='#2563eb';
changeModeBtn.style.color='white';
changeModeBtn.style.transition='background-color 0.2s ease, transform 0.1s ease';
changeModeBtn.onmouseover=()=>{changeModeBtn.style.backgroundColor='#1d4ed8'; changeModeBtn.style.transform='scale(1.05)';};
changeModeBtn.onmouseout=()=>{changeModeBtn.style.backgroundColor='#2563eb'; changeModeBtn.style.transform='scale(1)';};
changeModeBtn.onclick=()=>{
  renderModeMenu();
  changeModeBtn.style.display='none';
  restartBtn.style.display='none';
};
document.body.appendChild(changeModeBtn);

// Restart
restartBtn.addEventListener('click', resetGame);

// Initialize
renderModeMenu();
drawBoard();