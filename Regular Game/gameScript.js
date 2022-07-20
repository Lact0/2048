window.onresize = changeWindow;

function load() {
  canvas = document.querySelector('.canvas');
  ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  document.onkeydown = keyPress;
  mainBoard = new Board();
  mainBoard.draw();
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
  let ret = true;
  if(key.keyCode == 37) {
    ret = mainBoard.move('l');
    //move left
  }
  if(key.keyCode == 38) {
    ret = mainBoard.move('u');
    //move up
  }
  if(key.keyCode == 39) {
    ret = mainBoard.move('r');
    //move right
  }
  if(key.keyCode == 40) {
    ret = mainBoard.move('d');
    //move down
  }
  if(!ret) {
    end();
  }
  mainBoard.draw();
}

function end() {
  alert('GAME OVER');
  mainBoard = new Board();
}

function leftClick() {
  const x = event.clientX;
  const y = event.clientY;
}
