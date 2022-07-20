function sigmoid(z) {
  return (1 / (1 + Math.exp(-z)));
}

const mutationRate = .01;

class Neuron {
  constructor(numIn) {
    this.numIn = numIn;
    this.weights = [];
    for(let i = 0; i < numIn + 1; i++) {
      this.weights.push(Math.random() * 2 - 1);
    }
  }

  pass(input, train = false) {
    input.push(1);
    if(input.length != this.weights.length) {
      return false;
    }
    let sum = 0;
    for(let i = 0; i < input.length; i++) {
      sum += this.weights[i] * input[i];
    }
    input.pop();
    if(train) {
      return [sum, sigmoid(sum)];
    }
    return sigmoid(sum);
  }
}

class NeuralNetwork {
  //dim is an array like [3, 4, 5, 3], where the length of the array is the number of layers
  //and the number is the depth of the layer
  constructor(numIn, dim) {
    this.numIn = numIn;
    this.dim = dim;
    this.net = [];
    let temp = [];
    for(let i = 0; i < dim[0]; i++) {
      temp.push(new Neuron(numIn));
    }
    this.net.push(temp);
    for(let i = 1; i < dim.length; i++) {
      temp = [];
      for(let j = 0; j < dim[i]; j++) {
        temp.push(new Neuron(dim[i - 1]));
      }
      this.net.push(temp);
    }
  }

  pass(input) {
    if(input.length != this.numIn) {
      return false;
    }
    for(let i = 0; i < this.net.length; i++) {
      const temp = [];
      for(let x = 0; x < this.net[i].length; x++) {
        temp.push(this.net[i][x].pass(input));
      }
      input = temp;
    }
    return input;
  }

  draw(color = 'white', r = 1) {
    if(this.numIn != 1 || this.dim[this.dim.length - 1] != 1) {
      return false;
    }
    ctx.fillStyle = color;
    for(let x = 0; x < width; x++) {
      const y = this.pass([x / width]);
      ctx.fillRect(x, height - (y * height), r, r);
    }
    return true;
  }

  makeChild(net) {
    if(this.numIn != net.numIn || !equals(this.dim, net.dim)) {
      return false;
    }

    const child = new NeuralNetwork(this.numIn, this.dim);

    for(let x = 0; x < this.net.length; x++) {
      for(let y = 0; y < this.net[x].length; y++) {
        for(let z = 0; z < this.net[x][y].weights.length; z++) {
          let newWeight;
          if(rand(0, 1) == 0) {
            newWeight = this.net[x][y].weights[z];
          } else {
            newWeight = net.net[x][y].weights[z];
          }

          if(Math.random() < .1) {
            newWeight += Math.random() - .5;
          }

          child.net[x][y].weights[z] = newWeight;
        }
      }
    }
    return child;
  }

  train(input, answer, lr = .01) {
    if(input.length != this.numIn) {
      return false;
    }
    const out = [];
    const inp = [];
    for(let i = 0; i < this.net.length; i++) {
      input.push(1);
      out.push(copy(input));
      input.pop();
      const temp = [];
      const inTemp = [];
      for(let x = 0; x < this.net[i].length; x++) {
        const result = this.net[i][x].pass(input, true);
        temp.push(result[1]);
        inTemp.push(result[0]);
      }
      inp.push(inTemp);
      input = temp;
    }
    const predicted = input;
    for(let x = 0; x < inp[inp.length - 1].length; x++) {
      inp[inp.length - 1][x] = -2 * (answer[x] - predicted[x]) * (sigmoid(inp[inp.length - 1][x])) * (1 - sigmoid(inp[inp.length - 1][x]));
    }
    for(let x = inp.length - 2; x >= 0; x--) {
      for(let y = 0; y < inp[x].length; y++) {
        let sum = 0;
        for(let z = 0; z < inp[x + 1].length; z++) {
          sum += inp[x + 1][z] * this.net[x + 1][z].weights[y];
        }
        inp[x][y] = sum * (sigmoid(inp[x][y]) * (1 - sigmoid(inp[x][y])));
      }
    }
    for(let x = 0; x < this.net.length; x++) {
      for(let y = 0; y < this.net[x].length; y++) {
        for(let z = 0; z < this.net[x][y].weights.length; z++) {
          this.net[x][y].weights[z] -= inp[x][y] * out[x][z] * lr;
        }
      }
    }
    return predicted;
  }
}
