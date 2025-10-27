// ---  Initial Constants + Variables ---
const startReset = document.getElementById('start-reset');
const pausePlay = document.getElementById('pause-play');
const save = document.getElementById('save');
const step = document.getElementById('step');
const stepCount = document.getElementById('stepCount');
const bAntCell = document.getElementById('bAnt-cell');
const bDirection = document.getElementById('bDirection');
const bColor = document.getElementById('bColor');
const canvas = document.getElementById('kansas');
const colorCode = document.getElementById('color-code');
const turnCode = document.getElementById('turn-code');
const distanceCode = document.getElementById('distance-code');
const ctx = canvas.getContext('2d');
const cellSize = 5;
var started = false;
var playing = false;
var steps = 0;
var buAnt = true;
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


  flipCell(x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      switch (this.grid[y][x] = this.grid[y][x]) {
        case 0: this.grid[y][x] = parseInt(colorCode.value[0]); break;
        case 1: this.grid[y][x] = parseInt(colorCode.value[1]); break;
        case 2: this.grid[y][x] = parseInt(colorCode.value[2]); break;
        case 3: this.grid[y][x] = parseInt(colorCode.value[3]); break;
        case 4: this.grid[y][x] = parseInt(colorCode.value[4]); break;
        case 5: this.grid[y][x] = parseInt(colorCode.value[5]); break;
        case 6: this.grid[y][x] = parseInt(colorCode.value[6]); break;
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


// --- Ant Class ---
class Ant {
  constructor(x, y, d) {
    this.x = x;
    this.y = y;
    this.direction = d;
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
let ants = [ new Ant(Math.floor(gridSizeX / 2), Math.floor(gridSizeY / 2), 0) ];
ants.forEach(a => a.draw());


grid.enableClickSelection((cell) => {
  if (!cell) return;
  if (buCell) {
    grid.grid[cell.y][cell.x] = buColor;
    grid.draw();
    ants.forEach(a => a.draw());
  } else {
    const beforeCount = ants.length;
    ants = ants.filter(a => !(a.x === cell.x && a.y === cell.y)); //No clue how this works
    const afterCount = ants.length;
    if (afterCount === beforeCount) {
      // No ants were removed -> add a new ant at the clicked location
      const newAnt = new Ant(cell.x, cell.y, buDirection);
      ants.push(newAnt);
    }


    grid.draw();
    ants.forEach(a => a.draw());
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
    ants = [ new Ant(Math.floor(gridSizeX / 2), Math.floor(gridSizeY / 2), 0) ];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ants.forEach(a => a.draw());
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
  if (ants.length === 0) return;


  const decisions = ants.map(a => {
    const cellColor = grid.getCell(a.x, a.y);
    let newDir;
    switch (cellColor) {
      case 0: newDir = (a.direction + parseInt(turnCode.value[0])) % 4; break;
      case 1: newDir = (a.direction + parseInt(turnCode.value[1])) % 4; break;
      case 2: newDir = (a.direction + parseInt(turnCode.value[2])) % 4; break;
      case 3: newDir = (a.direction + parseInt(turnCode.value[3])) % 4; break;
      case 4: newDir = (a.direction + parseInt(turnCode.value[4])) % 4; break;
      case 5: newDir = (a.direction + parseInt(turnCode.value[5])) % 4; break;
      case 6: newDir = (a.direction + parseInt(turnCode.value[6])) % 4; break;
    }
    return { ant: a, newDir, x: a.x, y: a.y };
  });


  const flipCounts = new Map();
  decisions.forEach(d => {
    const key = `${d.x},${d.y}`; // No clue how this works
    flipCounts.set(key, (flipCounts.get(key) || 0) + 1);
  });
  flipCounts.forEach((count, key) => {
    if (count % 2 === 1) {
      const [sx, sy] = key.split(',').map(Number);
      grid.flipCell(sx, sy);
    }
  });


  decisions.forEach(d => {
    const a = d.ant;
    a.direction = d.newDir;
    let distance;
    switch (grid.getCell(a.x, a.y)) {
      case 0: distance = parseInt(distanceCode.value[0]); break;
      case 1: distance = parseInt(distanceCode.value[1]); break;
      case 2: distance = parseInt(distanceCode.value[2]); break;
      case 3: distance = parseInt(distanceCode.value[3]); break;
      case 4: distance = parseInt(distanceCode.value[4]); break;
      case 5: distance = parseInt(distanceCode.value[5]); break;
      case 6: distance = parseInt(distanceCode.value[6]); break;
    }
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
  ants.forEach(a => a.draw());
  steps++;
  stepCount.textContent = `${steps}`;
}


// --- Build Control ---
save.onclick = () => { // Move it to Rule Controls later
  const link = document.createElement("a");
  link.download = "pattern.png";
  link.href = canvas.toDataURL();
  link.click();
}


bAntCell.onclick = () => {
  buCell ? buCell = false : buCell = true;
  buAnt ? buAnt = false : buAnt = true;
  if (buAnt) {
    bAntCell.textContent = 'ant';
    bDirection.classList.remove('hidden');
    bColor.classList.add('hidden');
  } else {
    bAntCell.textContent = 'cell';
    bDirection.classList.add('hidden');
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
