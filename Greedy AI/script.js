window.onresize = changeWindow;
const choices = ['l', 'u', 'r', 'd'];
const movesPerSecond = 4;
let mainBoard = new Board();
let run;


function load() {
  canvas = document.querySelector('.canvas');
  ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  document.onkeydown = keyPress;
  run = setInterval(aiTurn, 1000 / movesPerSecond);
}

function aiTurn() {
  mainBoard.move(aiDecide(mainBoard));
  mainBoard.draw();
}

function aiDecide(board) {
  max = 0;
  maxInd = 0;
  for(let i = 0; i < 4; i++) {
    const newBoard = board.copy();
    newBoard.move(choices[i]);
    const score = getEmptyTiles(newBoard);
    if(score > max) {
      max = score;
      maxInd = i;
    }
  }
  return choices[maxInd];
}

function getEmptyTiles(board) {
  let total = 0;
  for(let x = 0; x < 4; x++) {
    for(let y = 0; y < 4; y++) {
      if(board.arr[x][y] == 0) {
        total++;
      }
    }
  }
  return total;
}

function changeWindow() {
  width = window.innerWidth;
  height = window.innerHeight;
  unit = parseInt(min(width, height) / 5);
  xStart = parseInt((width - unit * 4) / 2);
  yStart = parseInt((height - unit * 4) / 2);
  //REDRAW SCREEN
  mainBoard.draw();
}

function keyPress(key) {
  if(key.keyCode == 32) {
    if(run) {
      clearInterval(run);
    } else {
      run = setInterval(aiTurn, 1000 / movesPerSecond);
    }
  }
}

function leftClick() {
  const x = event.clientX;
  const y = event.clientY;
}
