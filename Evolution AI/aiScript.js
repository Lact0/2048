window.onresize = changeWindow;
const choices = ['l', 'u', 'r', 'd'];
const generations = 100;
const genSize = 500;
const aiDim = [16, 10, 10, 5, 4];
let gen = 0;
let ai;
let cont = true;
let run;

function load() {
  canvas = document.querySelector('.canvas');
  ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  document.onkeydown = keyPress;
  train();
}

function train(population = false) {
  gen++;
  if(gen % Math.pow(10, String(gen).length - 1) == 0) {
    console.log(gen);
  }
  if(!population) {
    population = [];
    for(let i = 0; i < genSize; i++) {
      population.push(new NeuralNetwork(16, aiDim));
    }
  }

  scores = [];
  for(let i = 0; i < genSize; i++) {
    const board = new Board();
    while(true) {
      const decision = population[i].pass(convert(board.arr));

      let max = decision[0];
      let maxInd = 0;
      for(let x = 1; x < decision.length; x++) {
        if(decision[x] > max) {
          max = decision[x];
          maxInd = x;
        }
      }

      let outcome = board.move(choices[maxInd]);

      if(!outcome || outcome == 'NO CHANGE') {
        break;
      }
    }
    scores.push(board.score);
  }

  let max = scores[0];
  let maxInd = 0;
  let min = scores[0];
  let total = 0;
  for(let i = 1; i < scores.length; i++) {
    if(scores[i] > max) {
      max = scores[i];
      maxInd = i;
    }
    if(scores[i] < min) {
      min = scores[i];
    }
    total += scores[i];
  }

  ai = population[maxInd];

  total -= min * scores.length;
  for(let i = 0; i < scores.length; i++) {
    scores[i] -= min;
  }

  let newPop = [];

  for(let c = 0; c < genSize; c++) {
    const parents = [];
    for(let z = 0; z < 2; z++) {
      let n = rand(1, total);
      let i = -1;
      while(n > 0) {
        i++;
        n -= scores[i];
      }
      parents.push(i);
    }
    if(scores[parents[0]] < scores[parents[1]]) {
      let z = parents[0];
      parents[0] = parents[1];
      parents[1] = z;
    }

    parents[0] = population[parents[0]];
    parents[1] = population[parents[1]];

    newPop.push(parents[0].makeChild(parents[1]));
  }
  
  if(cont) {
    window.requestAnimationFrame(f => {
      train(newPop);
    });
  }
}

function convert(inp) {
  let ret = [];
  for(let x = 0; x < inp.length; x++) {
    for(let y = 0; y < inp[x].length; y++) {
      ret.push(inp[x][y]);
    }
  }
  return ret;
}

function aiTurn() {
  const decision = ai.pass(convert(mainBoard.arr));

  let max = decision[0];
  let maxInd = 0;
  for(let x = 1; x < decision.length; x++) {
    if(decision[x] > max) {
      max = decision[x];
      maxInd = x;
    }
  }

  let outcome = mainBoard.move(choices[maxInd]);

  if(!outcome || outcome == 'NO CHANGE') {
    mainBoard = new Board();
  }

  mainBoard.draw();
}

function getNet() {
  return JSON.stringify(ai);
}

function changeWindow() {
  width = window.innerWidth;
  height = window.innerHeight;
  unit = parseInt(min(width, height) / 5);
  xStart = parseInt((width - unit * 4) / 2);
  yStart = parseInt((height - unit * 4) / 2);
  //REDRAW SCREEN
}

function keyPress(key) {
  if(key.keyCode == 32) {
    cont = !cont;
    if(!cont) {
      mainBoard = new Board();
      mainBoard.draw();
      run = setInterval(aiTurn, 200);
    } else {
      clearInterval(run);
      train();
    }
  }
}

function leftClick() {
  const x = event.clientX;
  const y = event.clientY;
}
