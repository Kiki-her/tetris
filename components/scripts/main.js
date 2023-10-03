const board = document.getElementById('board');
const startButton = document.getElementById("start_button")

for (let i = 0; i < 200; i++) {
    createCells(board);
}

const tetrominoes = [
    [
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [1, 1],
      [1, 1]
    ],
    [
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0]
    ],
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ]
  ];

startButton.addEventListener("click", () => {
    gaming();
})



// utils

function createCells(parent) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    parent.appendChild(cell);
}

/* tetriminoを回転させる */
function rorate(array) {
    const arrIndex = array.length - 1;
    const result = array.map((row, i) => row.map((val, j) => array[arrIndex - j][i]));
    return result;
}

/* 衝突判定 */
function isCollision(board, piece, offsetX, offsetY) {
    for (let i = 0; i < piece.length; i++) {
        for (let j = 0; j < piece[i].length; j++) {
          if (piece[i][j] &&
            (board[i + offsetY] &&
            board[i + offsetY][j + offsetX]) !== 0) {
            return true;
          }
        }
      }
      return false;
}

/* 移動 */
function movePiece(board, piece, offsetX, offsetY) {
    if (isCollision(board, piece, offsetX, offsetY)) {
        return false;
      }
    
    const newBoard = [...board];
    for (let i = 0; i < piece.length; i++) {
        for (let j = 0; j < piece[i].length; j++) {
          if (piece[i][j]) {
            newBoard[i + offsetY][j + offsetX] = 1;
          }
        }
      }
    
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          board[i][j] = newBoard[i][j];
        }
      }
      return true;
}

/* 一列揃った行をクリアにする */
function clearLines(board) {
    let cleardLines = 0;
    for (let i = board.length - 1; i >= 0; i--) {
        let isLineClear = true;
        for (let j = 0; j < board[i].length; j++) {
          if (!board[i][j]) {
            isLineClear = false;
            break;
          }
        }
    
        if (isLineClear) {
          board.splice(i, 1);
          board.unshift(Array(board[0].length).fill(0));
          cleardLines++;
        }
      }
    
      return cleardLines;
}

/* ボードの最上部を調べてGameOver判定 */
function isGameOver(board) {
    return board[0].some(cell => cell !== 0);
}

/* ゲームオーバーの時はリセット、そうでない時は続行 */
function startGame(board) {
    // Initialize board and variables
    const message = document.createElement("h1");
    message.classList.add("message");

    const cells = document.getElementsByClassName("cell");

    // ...
    if (isGameOver(board)) {
        Array.from(cells).map((ele) => ele.remove());
       
        message.innerText("GOOD JOB!");
        setTimeout(() => {
            const deleteMessage = document.getElementsByClassName("message");
            Array.from(deleteMessage).map((ele) => ele.remove());
            for (let i = 0; i < 200; i++) {
                createCells(board);
            }
        }, 3000)

      // Show game over message and reset the game
    } else {
      // Continue the game loop
      gaming();
    }
  }

  function updateBoard(board, currentTetromino) {
    // ゲームボード上のセル要素を取得
    const cells = document.getElementsByClassName('cell');
  
    // ボードの行数と列数を取得
    const numRows = board.length;
    const numCols = board[0].length;
  
    // ゲームボードを表示
    for (let y = 0; y < numRows; y++) {
      for (let x = 0; x < numCols; x++) {
        const cellIndex = y * numCols + x;
        const cellElement = cells[cellIndex];
  
        // ボード上の値に基づいてセルの表示を更新
        if (board[y][x] === 1) {
          cellElement.classList.add('filled');
        } else {
          cellElement.classList.remove('filled');
        }
      }
    }
  
    // テトリミノを表示
    if (currentTetromino) {
      const tetrominoShape = currentTetromino.shape;
      const tetrominoX = currentTetromino.x;
      const tetrominoY = currentTetromino.y;
  
      for (let y = 0; y < tetrominoShape.length; y++) {
        for (let x = 0; x < tetrominoShape[y].length; x++) {
          if (tetrominoShape[y][x] === 1) {
            // テトリミノのセルを表示
            const boardX = tetrominoX + x;
            const boardY = tetrominoY + y;
            const cellIndex = boardY * numCols + boardX;
            const cellElement = cells[cellIndex];
            cellElement.classList.add('filled');
          }
        }
      }
    }
  }

  
/* ゲームメインループ */
function gaming() {
    const randomTetromino = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    const tetrominoX = Math.floor((10 - randomTetromino[0].length) / 2); 
    const tetrominoY = 0; 
    const currentTetromino = {
      shape: randomTetromino,
      x: tetrominoX,
      y: tetrominoY,
    };
  
    if (!movePiece(board, currentTetromino.shape, currentTetromino.x, currentTetromino.y)) {
      startGame(board);
      return;
    }
  
    updateBoard(board, currentTetromino);
  
    setTimeout(() => {
      gaming();
    }, 1000);
  }
  