// ---  Initial Constants + Variables ---
const startReset = document.getElementById('start-reset');
const pausePlay = document.getElementById('pause-play');
const save = document.getElementById('save');
const step = document.getElementById('step');
const stepCount = document.getElementById('stepCount');
const bAntCell = document.getElementById('bAnt-cell'); // b stands for "in build section"
const bDirection = document.getElementById('bDirection');
const bColor = document.getElementById('bColor');
const canvas = document.getElementById('kansas');
const ctx = canvas.getContext('2d');
const cellSize = 5; // Size of each cell in pixels
var started = false;
var playing = false;
var steps = 0;
var buAnt = true; // bu satands for "building"
var buDirection = 0; // 0: North, 1: East, 2: South, 3: West
var buCell = false;
var buColor = 'white';

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
      this.grid[y][x] = this.grid[y][x] === 0 ? 1 : 0;
    }
  }

  getCell(x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.grid[y][x];
    }
    return null;
  }

  /**
   * Map canvas client coordinates (e.g. MouseEvent.clientX/Y) to grid cell indices
   * and return an object { x, y, value } or null if outside grid.
   * This accounts for the canvas CSS size vs drawing buffer.
   */
  cellAtCanvasPoint(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    // Calculate CSS pixel coordinates relative to canvas
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

  /**
   * Attach a click listener to the canvas that calls `callback(cellInfo, event)`
   * where cellInfo is { x, y, value } or null when click is outside grid.
   * Returns a function to remove the listener.
   */
  enableClickSelection(callback) {
    const fCell = (ev) => { // f stands for "flip"
      const cell = this.cellAtCanvasPoint(ev.clientX, ev.clientY);
      callback(cell, ev);
    };
    canvas.addEventListener('click', fCell);
    return () => canvas.removeEventListener('click', fCell);
  }

  draw() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        ctx.fillStyle = this.getCell(x, y) === 1 ? 'white' : 'black';
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
    this.direction = d; // 0: North, 1: East, 2: South, 3: West
  }

  move() {
    const cellColor = grid.getCell(this.x, this.y);

    if (cellColor === 0) {
      this.direction = (this.direction + 1) % 4;
    } else {
      this.direction = (this.direction - 1 + 4) % 4;
    }

    grid.flipCell(this.x, this.y);

    switch (this.direction) {
      case 0: this.y-=1; break; // North
      case 1: this.x+=1; break; // East
      case 2: this.y+=1; break; // South
      case 3: this.x-=1; break; // West
    }

    this.x = (this.x + gridSizeX) % gridSizeX;
    this.y = (this.y + gridSizeY) % gridSizeY;
  }

  draw() {
    switch (this.direction) {
      case 0: ctx.fillStyle = 'red'; break; // North
      case 1: ctx.fillStyle = 'yellow'; break; // East
      case 2: ctx.fillStyle = 'green'; break; // South
      case 3: ctx.fillStyle = 'blue'; break; // West
    }
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
  }
}

const grid = new Grid(gridSizeX, gridSizeY);
let ants = [ new Ant(Math.floor(gridSizeX / 2), Math.floor(gridSizeY / 2), 0) ];
ants.forEach(a => a.draw());

// Enable clicking the canvas to flip the clicked cell's color and redraw.
// This works whether simulation has started or not.
grid.enableClickSelection((cell) => {
  if (!cell) return;
  if (buCell) {
    // Flip a grid cell when in cell-build mode
    grid.flipCell(cell.x, cell.y);
    grid.draw();
    // redraw all ants after grid change
    ants.forEach(a => a.draw());
  } else {
    // When not in cell-build mode, if there are any ants on the clicked tile,
    // remove them. Otherwise, create a new Ant at that location.
    const beforeCount = ants.length;
    // Remove ants that sit exactly on the clicked tile
    ants = ants.filter(a => !(a.x === cell.x && a.y === cell.y));
    const afterCount = ants.length;

    if (afterCount === beforeCount) {
      // No ants were removed -> add a new ant at the clicked location
      const newAnt = new Ant(cell.x, cell.y, buDirection);
      ants.push(newAnt);
    }

    // redraw grid and all ants
    grid.draw();
    ants.forEach(a => a.draw());
  }
});

function animate() {
  // Move every ant in the array
  ants.forEach(a => a.move());
  // Draw grid then all ants
  grid.draw();
  ants.forEach(a => a.draw());
  steps++;
  stepCount.textContent = `${steps}`;
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
    // Reset ants array to a single ant centered in the grid
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
  ants.forEach(a => a.move());
  grid.draw();
  ants.forEach(a => a.draw());
  steps++;
  stepCount.textContent = `${steps}`;
}

save.onclick = () => {
  const link = document.createElement("a");
  link.download = "pattern.png";
  link.href = canvas.toDataURL();
  link.click();
}

// --- Build Control ---
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

bColor.onclick = () => {}