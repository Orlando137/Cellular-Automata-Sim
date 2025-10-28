// ---  Initial Constants + Variables ---
const startReset = document.getElementById('start-reset');
const pausePlay = document.getElementById('pause-play');
const save = document.getElementById('save');
const step = document.getElementById('step');
const stepCount = document.getElementById('stepCount');
const bAutoCell = document.getElementById('bAuto-cell');
const bKill = document.getElementById('bKill');
const bDirection = document.getElementById('bDirection');
const bColor = document.getElementById('bColor');
const canvas = document.getElementById('kansas');
const graphName = document.getElementById('graph-name');
const colorCode = document.getElementById('color-code');
const turnCode = document.getElementById('turn-code');
const distanceCode = document.getElementById('distance-code');
const randomColor = document.getElementById('random-color');
const randomTurn = document.getElementById('random-turn');
const randomDistance = document.getElementById('random-distance');
const ctx = canvas.getContext('2d');
const cellSize = 5;
var started = false;
var playing = false;
var steps = 0;
var buAuto = true;
var buDirection = 0;
var buCell = false;
var buColor = 0;

canvas.width = 600;
canvas.height = 600;
const gridSizeX = Math.floor(canvas.width / cellSize);
const gridSizeY = Math.floor(canvas.height / cellSize);


// --- Grid Class ---
class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = this.createGrid();
  }


  createGrid() {
    return Array(this.height).fill(null).map(() => Array(this.width).fill(0));
  }


  flipCell(x, y, auto) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      switch (this.grid[y][x]) {
        case 0: this.grid[y][x] = parseInt(auto.colorCode[0]); break;
        case 1: this.grid[y][x] = parseInt(auto.colorCode[1]); break;
        case 2: this.grid[y][x] = parseInt(auto.colorCode[2]); break;
        case 3: this.grid[y][x] = parseInt(auto.colorCode[3]); break;
        case 4: this.grid[y][x] = parseInt(auto.colorCode[4]); break;
        case 5: this.grid[y][x] = parseInt(auto.colorCode[5]); break;
        case 6: this.grid[y][x] = parseInt(auto.colorCode[6]); break;
      }
    }
  }


  getCell(x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.grid[y][x];
    }
    return null;
  }


  cellAtCanvasPoint(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const cssX = clientX - rect.left;
    const cssY = clientY - rect.top;


    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;


    const canvasX = Math.floor(cssX * scaleX);
    const canvasY = Math.floor(cssY * scaleY);


    const gridX = Math.floor(canvasX / cellSize);
    const gridY = Math.floor(canvasY / cellSize);


    if (gridX >= 0 && gridX < this.width && gridY >= 0 && gridY < this.height) {
      return { x: gridX, y: gridY, value: this.getCell(gridX, gridY) };
    }
    return null;
  }


  enableClickSelection(callback) { // No idea how this works
    const fCell = (ev) => {
      const cell = this.cellAtCanvasPoint(ev.clientX, ev.clientY);
      callback(cell, ev);
    };
    canvas.addEventListener('click', fCell);
    return () => canvas.removeEventListener('click', fCell);
  }


  draw() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        switch (this.getCell(x, y)) {
          case 0: ctx.fillStyle = 'rgb(0, 0, 0)'; break;       // Black
          case 1: ctx.fillStyle = 'rgb(255, 0, 0)'; break;     // Red
          case 2: ctx.fillStyle = 'rgb(255, 255, 0)'; break;     // Yellow
          case 3: ctx.fillStyle = 'rgb(0, 255, 0)'; break;     // Green
          case 4: ctx.fillStyle = 'rgb(0, 255, 255)'; break;   // Cyan
          case 5: ctx.fillStyle = 'rgb(0, 0, 255)'; break;   // Blue
          case 6: ctx.fillStyle = 'rgb(255, 0, 255)'; break;   // Magenta
        }
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}


// --- Auto Class ---
class Auto {
  constructor(x, y, d) {
    this.x = x;
    this.y = y;
    this.direction = d;
    this.colorCode = colorCode.value;
    this.turnCode = turnCode.value;
    this.distanceCode = distanceCode.value;
  }


  draw() {
    switch (this.direction) {
      case 0: ctx.fillStyle = 'rgb(51, 51, 51)'; break;
      case 1: ctx.fillStyle = 'rgb(102, 102, 102)'; break;
      case 2: ctx.fillStyle = 'rgb(153, 153, 153)'; break;
      case 3: ctx.fillStyle = 'rgb(204, 204, 204)'; break;
    }
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
  }
}


const grid = new Grid(gridSizeX, gridSizeY);
let autos = [ new Auto(Math.floor(gridSizeX / 2), Math.floor(gridSizeY / 2), 0) ];
autos.forEach(a => a.draw());


grid.enableClickSelection((cell) => {
  if (!cell) return;
  if (buCell) {
    grid.grid[cell.y][cell.x] = buColor;
    grid.draw();
    autos.forEach(a => a.draw());
  } else {
    const beforeCount = autos.length;
    autos = autos.filter(a => !(a.x === cell.x && a.y === cell.y)); //No clue how this works
    const afterCount = autos.length;
    if (afterCount === beforeCount) {
      // No autos were removed -> add a new auto at the clicked location
      const newAuto = new Auto(cell.x, cell.y, buDirection);
      autos.push(newAuto);
    }


    grid.draw();
    autos.forEach(a => a.draw());
  }
});


function animate() {
  stepOnce();
  if (playing)
    requestAnimationFrame(animate);
}


// --- Flow Control ---
startReset.onclick = () => {
  if (started) {
    startReset.textContent = 'start';
    steps = 0;
    stepCount.textContent = `${steps}`;
    started = false;
    playing = false;
    grid.grid = grid.createGrid();
    autos = [ new Auto(Math.floor(gridSizeX / 2), Math.floor(gridSizeY / 2), 0) ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    autos.forEach(a => a.draw());
    requestAnimationFrame
    pausePlay.classList.add('hidden');
  } else {
    startReset.textContent = 'reset';
    pausePlay.textContent = 'pause';
    started = true;
    playing = true;
    animate();
    pausePlay.classList.remove('hidden');
    startReset.classList.add('hidden');
  }
}


pausePlay.onclick = () => {
  pausePlay.textContent = playing ? 'play' : 'pause';
  playing ? playing = false : playing = true;
  if (playing) {
    animate();
    startReset.classList.add('hidden');
  } else {
    startReset.classList.remove('hidden');
  }
};


step.onclick = () => {
  stepOnce();
}


function stepOnce() {
  if (autos.length === 0) return;


  const decisions = autos.map(a => {
    const cellColor = grid.getCell(a.x, a.y);
    let newDir;
    let distance;
    switch (cellColor) {
      case 0: 
        newDir = decideNewDirection(a.direction, parseInt(a.turnCode[0]));
        distance = parseInt(a.distanceCode[0]);
        break;
      case 1:
        newDir = decideNewDirection(a.direction, parseInt(a.turnCode[1]));
        distance = parseInt(a.distanceCode[1]);
        break;
      case 2:
        newDir = decideNewDirection(a.direction, parseInt(a.turnCode[2]));
        distance = parseInt(a.distanceCode[2]);
        break;
      case 3:
        newDir = decideNewDirection(a.direction, parseInt(a.turnCode[3]));
        distance = parseInt(a.distanceCode[3]);
        break;
      case 4:
        newDir = decideNewDirection(a.direction, parseInt(a.turnCode[4]));
        distance = parseInt(a.distanceCode[4]);
        break;
      case 5:
        newDir = decideNewDirection(a.direction, parseInt(a.turnCode[5]));
        distance = parseInt(a.distanceCode[5]);
        break;
      case 6:
        newDir = decideNewDirection(a.direction, parseInt(a.turnCode[6]));
        distance = parseInt(a.distanceCode[6]);
        break;
    }
    return { auto: a, newDir, x: a.x, y: a.y, distance };
  });


  const flipCounts = new Map();
  decisions.forEach(d => {
    const key = `${d.x},${d.y}`; // No clue how this works
    flipCounts.set(key, (flipCounts.get(key) || 0) + 1);
  });
  // Keep track of which auto was last to visit each cell
  const lastAutoAtCell = new Map();
  decisions.forEach(d => {
    lastAutoAtCell.set(`${d.x},${d.y}`, d.auto);
  });
  
  flipCounts.forEach((count, key) => {
    if (count % 2 === 1) {
      const [sx, sy] = key.split(',').map(Number);
      const auto = lastAutoAtCell.get(key);
      grid.flipCell(sx, sy, auto);
    }
  });


  decisions.forEach(d => {
    const a = d.auto;
    a.direction = d.newDir;
    const distance = d.distance;
    switch (a.direction) {
      case 0: a.y -= distance; break;
      case 1: a.x += distance; break;
      case 2: a.y += distance; break;
      case 3: a.x -= distance; break;
    }
    a.x = (a.x + gridSizeX) % gridSizeX;
    a.y = (a.y + gridSizeY) % gridSizeY;
  });


  grid.draw();
  autos.forEach(a => a.draw());
  steps++;
  stepCount.textContent = `${steps}`;
}

function decideNewDirection(i, x) {
  if(x < 4)
    i = (x + i) % 4;
  else
    switch(x) {
      case 4: i = 0; break;
      case 5: i = 1; break;
      case 6: i = 2; break;
      case 7: i = 3; break;
    }
  return i;
}

// --- Build Control ---


bAutoCell.onclick = () => {
  buCell ? buCell = false : buCell = true;
  buAuto ? buAuto = false : buAuto = true;
  if (buAuto) {
    bAutoCell.textContent = 'auto';
    bDirection.classList.remove('hidden');
    bKill.classList.remove('hidden');
    bColor.classList.add('hidden');
  } else {
    bAutoCell.textContent = 'cell';
    bDirection.classList.add('hidden');
    bKill.classList.add('hidden');
    bColor.classList.remove('hidden');
  }
}


bDirection.onclick = () => {
  switch (buDirection) {
    case 0: buDirection = 1; bDirection.textContent = 'east'; break;
    case 1: buDirection = 2; bDirection.textContent = 'south'; break;
    case 2: buDirection = 3; bDirection.textContent = 'west'; break;
    case 3: buDirection = 0; bDirection.textContent = 'north'; break;
  }
}

bKill.onclick = () => {
  autos.length = 0;
  grid.draw();
}


bColor.onclick = () => {
  switch (buColor) {
    case 0: buColor = 1; bColor.textContent = 'red'; break;
    case 1: buColor = 2; bColor.textContent = 'yellow'; break;
    case 2: buColor = 3; bColor.textContent = 'green'; break;
    case 3: buColor = 4; bColor.textContent = 'cyan'; break;
    case 4: buColor = 5; bColor.textContent = 'blue'; break;
    case 5: buColor = 6; bColor.textContent = 'magenta'; break;
    case 6: buColor = 0; bColor.textContent = 'black'; break;
  }
}

// --- Rule Control ---
save.onclick = () => {
  if (!graphName.value) {
    alert('Please enter a graph name before saving.');
    return;
  } else {
    const link = document.createElement("a");
    link.download = graphName.value + ".png";
    link.href = canvas.toDataURL();
    link.click();
  }
}

randomColor.onclick = () => {
  let newColorCode = '';
  newColorCode += Math.floor(Math.random() * 6 + 1).toString();
  for (let i = 0; i < 6; i++) {
    const randColor = Math.floor(Math.random() * 7);
    newColorCode += randColor.toString();
  }
  colorCode.value = newColorCode;
}

randomTurn.onclick = () => {
  let newTurnCode = '';
  newTurnCode += Math.floor(Math.random() * 3 + 1).toString();
  for (let i = 0; i < 7; i++) {
    const randTurn = Math.floor(Math.random() * 4);
    newTurnCode += randTurn.toString();
  }
  turnCode.value = newTurnCode;
}

randomDistance.onclick = () => {
  let newDistanceCode = '';
  for (let i = 0; i < 7; i++) {
    const randDistance = Math.floor(Math.random() * 2 + 1);
    newDistanceCode += randDistance.toString();
  }
  distanceCode.value = newDistanceCode;
}