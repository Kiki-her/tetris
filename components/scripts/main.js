const canvas = document.getElementById("square_canvas");
const rightButton = document.getElementById("right");
const leftButton = document.getElementById("left");
const roteteButton = document.getElementById("rotete");
const downButton = document.getElementById("down");
const upButton = document.getElementById("up");
const context = canvas.getContext("2d");
let isOver = false;

    //フィールドサイズ
const FIELD_COL = 10;
const FIELD_ROW = 20;

    //ブロック一つのサイズ(ピクセル)
const BLOCK_SIZE = 30;

    //スクリーンサイズ
const SCREEN_W = BLOCK_SIZE * FIELD_COL;
const SCREEN_H = BLOCK_SIZE * FIELD_ROW;

    //テトロミノのサイズ
const TETRO_SIZE = 4;

const GAME_SPEED = 1000;

canvas.width = SCREEN_W;
canvas.height = SCREEN_H;
canvas.style.border = "4px solid #555";

const TETRO_COLORS = [
    "#57CC99",
    "#38A3A5",
    "#C7F9CC",
    "#6CDD99",
    "#80ED99",
    "#80ED99",
    "#80ED99",
    "#80ED99",
]

//tetromimo本体 I, L, J, T, O, Z, S
const TETRO_TYPES = [
    [],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0]
    ],
]
   

const START_X = FIELD_COL / 2 - TETRO_SIZE / 2;
const START_Y = 0
    //テトロミノの座標
    let tetroX = START_X;
    let tetroY = START_Y;

    //フィールドの中身
    let field = [];
    let tetroType = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;
    let tetro = TETRO_TYPES[tetroType]

    init();
    drawAll();
    setInterval(dropTetro, GAME_SPEED);

    //初期化
    function init() {
      //フィールドのクリア
      for (let y = 0; y < FIELD_ROW; y++) {
        field[y] = [];
        for (let x = 0; x < FIELD_COL; x++) {
          field[y][x] = 0;
        }
      }
      //test
      field[5][8] = 1;
      field[19][9] = 1;
      field[19][0] = 1;
    }


    //ブロック一つを描画
    function drawBlock(x, y, c) {
      let px = x * BLOCK_SIZE;
      let py = y * BLOCK_SIZE;

      context.fillStyle = TETRO_COLORS[c];
      context.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
      context.strokeStyle = "black";
      context.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
    }
    //全部を描画
    function drawAll() {
      context.clearRect(0, 0, SCREEN_W, SCREEN_H);

      for (let y = 0; y < FIELD_ROW; y++) {
        for (let x = 0; x < FIELD_COL; x++) {
          if (field[y][x]) {
            drawBlock(x, y, field[y][x]);
          }
        }
      }

      for (let y = 0; y < TETRO_SIZE; y++) {
        for (let x = 0; x < TETRO_SIZE; x++) {
          if (tetro[y][x]) {
            drawBlock(tetroX + x, tetroY + y, tetroType);
          }
        }
      }
      if(isOver) {
        let text = "GOOD JOB!"
        context.font = "40px 'MS ゴシック";
        let textW = context.measureText(text).width;
        let x = SCREEN_W / 2 - textW / 2;
        let y = SCREEN_H / 2 - 20;
        context.lineWidth = 4;
        context.strokeText(text, x, y);
        context.fillStyle = "white";
        context.fillText(text, x, y);
      }
    }


function checkMove(mx, my, ntetro) {
    if(ntetro === undefined) {
        ntetro = tetro;
    }
    for (let y = 0; y < TETRO_SIZE; y++) {
        for (let x = 0; x < TETRO_SIZE; x++) {
            if (ntetro[y][x]) {
                let nx = tetroX + mx + x;
                let ny = tetroY + my + y;
                if(ny < 0 || nx < 0 || ny >= FIELD_ROW || nx >= FIELD_COL || field[ny][nx]) {
                    return false;
                }
            }
        }
    }
    return true;
}
function rotete() {
    let newTetro = [];
     for (let y = 0; y < TETRO_SIZE; y++) {
        newTetro[y] = []
        for (let x = 0; x < TETRO_SIZE; x++) {
            newTetro[y][x] = tetro[TETRO_SIZE - 1 - x][y];
        }
    }
    return newTetro;
}

function fixTetro() {
    for (let y = 0; y < TETRO_SIZE; y++) {
        for (let x = 0; x < TETRO_SIZE; x++) {
            if(tetro[y][x]) {
                field[tetroY + y][tetroX + x] = tetroType;
            }
        }
    }
}

function checkLine() {
    let count = 0;
    for (let y = 0; y < FIELD_ROW; y++) {
        let flag = true;
        for (let x = 0; x < FIELD_COL; x++) {
            if(!field[y][x]) {
                flag = false;
                break;
            }
        }
        if(flag) {
            count++;
            for(let ny = y; ny > 0; ny--) {
                for(let nx = 0; nx < FIELD_COL; nx++) {
                    field[ny][nx] = field[ny-1][nx];
                }
            }
        }
    }
}

function dropTetro() {
    if(isOver) return;
     if(checkMove(0, 1)) {
        tetroY++;
    } else {
        fixTetro();
        checkLine();
        tetroType = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;
        tetro = TETRO_TYPES[tetroType]
        tetroX = START_X;
        tetroY = START_Y;

        if(!checkMove(0, 0)) {
            isOver = true;
        }
    }
      drawAll()
}

leftButton.addEventListener("click", () => {
    if(!isOver && checkMove(-1, 0)) {
        tetroX--;
        drawAll()
    }

}) 
upButton.addEventListener("click", () => {
// 上
 if(!isOver &&checkMove(0, -1)) {
    tetroY--;
    drawAll()
    }

}) 
rightButton.addEventListener("click", () => {
    if(!isOver &&checkMove(1, 0)) {
        tetroX++;
        drawAll()
    }
})  
downButton.addEventListener("click", () => {
     if(!isOver &&checkMove(0, 1)) {
        tetroY++;
        drawAll()
    }
}) 
roteteButton.addEventListener("click", () => {

   let newTetro = rotete(); 
   if(!isOver &&checkMove(0, 0, newTetro)) {
    tetro = newTetro;
   }
}) 

