//Vars
const DIR = [0, 1, 0, -1, 0];
let width = window.innerWidth;
let height = window.innerHeight;
let unit = parseInt(min(width, height) / 5);
let xStart = parseInt((width - unit * 4) / 2);
let yStart = parseInt((height - unit * 4) / 2);
let canvas;
let ctx;

//Useful Functions
function max(n1, n2) {
  if(n1 > n2) {
    return n1;
  }
  return n2;
}

function min(n1, n2) {
  if(n1 < n2) {
    return n1;
  }
  return n2;
}

function randColor() {
  return 'rgba(' + rand(0,255) + ',' + rand(0,255) + ',' + rand(0,255) + ')';
}

function rand(min, max) {
  return Math.floor(Math.random() * (max-min+1)) + (min);
}
function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function radToDeg(rad) {
  return rad / Math.PI * 180;
}

function drawLine(x1, y1, x2, y2, style = white, r = 1) {
  ctx.strokeStyle = style;
  ctx.lineWidth = r;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function equals(arr1, arr2) {
  if(arr1.length != arr2.length) {
    return false;
  }
  for(let i = 0; i < arr1.length; i++) {
    if(arr1[i] != arr2[i]) {
      return false;
    }
  }
  return true;
}

function copy(arr) {
  return JSON.parse(JSON.stringify(arr));
}

function remove(arr, n) {
  let i = arr.indexOf(n);
  if(i >= 0) {
    arr.splice(i, 1);
    return true;
  }
  return false;
}

function getDigits(n) {
  return String(n).length;
}

//Classes

class Board {
  constructor() {
    this.arr = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    this.genTile();
    this.score = 0;
  }

  draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = String(parseInt(unit * .25)) + 'pt Courier New';
    for(let x = 0; x < 4; x++) {
      for(let y = 0; y < 4; y++) {
        ctx.strokeRect(xStart + x * unit, yStart + y * unit, unit, unit);
        if(this.arr[x][y] == 0) {
          continue;
        }
        ctx.strokeText(Math.pow(2, this.arr[x][y]), xStart + (x + .5) * unit, yStart + (y + .55) * unit);
      }
    }
  }

  collapse(dir) {
    let ret = false;
    let queue = [];
    switch(dir) {
      case 'l':
        for(let x = 0; x < 4; x++) {
          for(let y = 0; y < 4; y++) {
            if(this.arr[x][y] != 0) {
              queue.push([x, y]);
            }
          }
        }
        while(queue.length > 0) {
          let pos = queue.shift();
          while(pos[0] > 0 && this.arr[pos[0] - 1][pos[1]] == 0) {
            ret = true;
            this.arr[pos[0] - 1][pos[1]] = this.arr[pos[0]][pos[1]];
            this.arr[pos[0]][pos[1]] = 0;
            pos[0] -= 1;
          }
        }
        break;
      case 'u':
        for(let y = 0; y < 4; y++) {
          for(let x = 0; x < 4; x++) {
            if(this.arr[x][y] != 0) {
              queue.push([x, y]);
            }
          }
        }
        while(queue.length > 0) {
          let pos = queue.shift();
          while(pos[1] > 0 && this.arr[pos[0]][pos[1] - 1] == 0) {
            ret = true;
            this.arr[pos[0]][pos[1] - 1] = this.arr[pos[0]][pos[1]];
            this.arr[pos[0]][pos[1]] = 0;
            pos[1] -= 1;
          }
        }
        break;
      case 'r':
        for(let x = 3; x >= 0; x--) {
          for(let y = 0; y < 4; y++) {
            if(this.arr[x][y] != 0) {
              queue.push([x, y]);
            }
          }
        }
        while(queue.length > 0) {
          let pos = queue.shift();
          while(pos[0] < 3 && this.arr[pos[0] + 1][pos[1]] == 0) {
            ret = true;
            this.arr[pos[0] + 1][pos[1]] = this.arr[pos[0]][pos[1]];
            this.arr[pos[0]][pos[1]] = 0;
            pos[0] += 1;
          }
        }
        break;
      case 'd':
        for(let y = 3; y >= 0; y--) {
          for(let x = 0; x < 4; x++) {
            if(this.arr[x][y] != 0) {
              queue.push([x, y]);
            }
          }
        }
        while(queue.length > 0) {
          let pos = queue.shift();
          while(pos[1] < 3 && this.arr[pos[0]][pos[1] + 1] == 0) {
            ret = true;
            this.arr[pos[0]][pos[1] + 1] = this.arr[pos[0]][pos[1]];
            this.arr[pos[0]][pos[1]] = 0;
            pos[1] += 1;
          }
        }
        break;
    }
    return ret;
  }

  merge(dir) {
    let ret = false;
    switch(dir) {
      case 'l':
        for(let x = 0; x < 3; x++) {
          for(let y = 0; y < 4; y++) {
            if(this.arr[x][y] != 0 && this.arr[x][y] == this.arr[x + 1][y]) {
              ret = true;
              this.arr[x][y] += 1;
              this.arr[x + 1][y] = 0;
              this.score += Math.pow(2, this.arr[x][y]);
            }
          }
        }
        break;
      case 'u':
        for(let y = 0; y < 3; y++) {
          for(let x = 0; x < 4; x++) {
            if(this.arr[x][y] != 0 && this.arr[x][y] == this.arr[x][y + 1]) {
              ret = true;
              this.arr[x][y] += 1;
              this.arr[x][y + 1] = 0;
              this.score += Math.pow(2, this.arr[x][y]);
            }
          }
        }
        break;
      case 'r':
        for(let x = 3; x > 0; x--) {
          for(let y = 0; y < 4; y++) {
            if(this.arr[x][y] != 0 && this.arr[x][y] == this.arr[x - 1][y]) {
              ret = true;
              this.arr[x][y] += 1;
              this.arr[x - 1][y] = 0;
              this.score += Math.pow(2, this.arr[x][y]);
            }
          }
        }
        break;
      case 'd':
        for(let y = 3; y > 0; y--) {
          for(let x = 0; x < 4; x++) {
            if(this.arr[x][y] != 0 && this.arr[x][y] == this.arr[x][y - 1]) {
              ret = true;
              this.arr[x][y] += 1;
              this.arr[x][y - 1] = 0;
              this.score += Math.pow(2, this.arr[x][y]);
            }
          }
        }
        break;
    }
    return ret;
  }

  move(dir) {
    const a = this.collapse(dir);
    const b = this.merge(dir);
    this.collapse(dir);
    let c = this.genTile();
    if(!c && this.checkEnd()) {
      return false;
    }
    if(!(a || b || c)) {
      return 'NO CHANGE';
    }
    return true;
  }

  genTile() {
    let openTiles = [];
    for(let x = 0; x < 4; x++) {
      for(let y = 0; y < 4; y++) {
        if(this.arr[x][y] == 0) {
          openTiles.push([x, y]);
        }
      }
    }
    if(openTiles.length == 0) {
      return false;
    }
    const newTileInd = openTiles[rand(0, openTiles.length - 1)];
    let newTile;
    if(rand(1, 10) < 10) {
      newTile = 1;
    } else {
      newTile = 2;
    }
    this.arr[newTileInd[0]][newTileInd[1]] = newTile;
    return true;
  }

  checkEnd() {
    for(let x = 0; x < 4; x++) {
      for(let y = 0; y < 4; y++) {
        for(let i = 0; i < 4; i++) {
          try {
            if(this.arr[x][y] == this.arr[x + DIR[i]][y + DIR[i + 1]]) {
              return false;
            }
          } catch {

          }
        }
      }
    }
    return true;
  }

  copy() {
    let copy = new Board();
    copy.arr = this.arr;
    copy.score = this.score;
    return copy;
  }
}
