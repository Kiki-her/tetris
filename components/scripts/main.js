const canvas = document.getElementById("square_canvas");
const rightButton = document.getElementById("right");
const leftButton = document.getElementById("left");
const leftSpinButton = document.getElementById("left_spin");
const rightSpinButton = document.getElementById("right_spin");
const downButton = document.getElementById("down");
const pauseButton = document.getElementById("pause");
const context = canvas.getContext("2d");

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



canvas.width = SCREEN_W;
canvas.height = SCREEN_H;
canvas.style.border = "4px solid #555";
    
    //テトロミノ本体
    let tetro = [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ];

    //テトロミノの座標
    let tetroX = 0;
    let tetroY = 0;

    //フィールドの中身
    let field = [];

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

    init();
    drawAll();

    //ブロック一つを描画
    function drawBlock(x, y) {
      let px = x * BLOCK_SIZE;
      let py = y * BLOCK_SIZE;

      context.fillStyle = "red";
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
            drawBlock(x,y);
          }
        }
      }

      for (let y = 0; y < TETRO_SIZE; y++) {
        for (let x = 0; x < TETRO_SIZE; x++) {
          if (tetro[y][x]) {
            drawBlock(tetroX + x,tetroY + y);
          }
        }
      }
    }


function checkMove(mx, my) {
    for (let y = 0; y < TETRO_SIZE; y++) {
        for (let x = 0; x < TETRO_SIZE; x++) {
            let nx = tetroX + mx + x;
            let ny = tetroY + my + y;
            if (tetro[y][x]) {
                if(field[ny][nx] !== 0 || ny < 0 || nx < 0 || ny >= FIELD_ROW || nx >= FIELD_COL) {
                    return false;
                }
            }
        }
    }
    return true;
}

leftButton.addEventListener("click", () => {
    if(checkMove(-1, 0)) {
        tetroX--;
        drawAll()
    }

}) 
pauseButton.addEventListener("click", () => {
// 上
 if(checkMove(0, -1)) {
    tetroY--;
    drawAll()
    }

}) 
rightButton.addEventListener("click", () => {
    if(checkMove(1, 0)) {
        tetroX++;
        drawAll()
    }
})  
downButton.addEventListener("click", () => {
     if(checkMove(0, 1)) {
        tetroY++;
        drawAll()
    }
}) 
// leftSpinButton.addEventListener("click", () => {
    
// }) 
// rightSpinButton.addEventListener("click", () => {

// }) 