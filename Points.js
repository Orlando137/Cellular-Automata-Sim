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
var buColor = 'rgb(255,255,255)';

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
        ctx.fillStyle = this.getCell(x, y) === 1 ? 'rgb(255,255,255)' : 'rgb(0,0,0)';
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

  draw() {
    switch (this.direction) {
      case 0: ctx.fillStyle = 'rgb(51, 51, 51)'; break; // North (red)
      case 1: ctx.fillStyle = 'rgb(102, 102, 102)'; break; // East (yellow)
      case 2: ctx.fillStyle = 'rgb(153, 153, 153)'; break; // South (green)
      case 3: ctx.fillStyle = 'rgb(204, 204, 204)'; break; // West (blue)
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
  // Perform one synchronized step for all ants (order-independent)
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
  stepOnce();
}

/**
 * stepOnce()
 * Perform one simulation step in an order-independent way:
 * - Read the current grid state once.
 * - For each ant, decide its new direction based solely on the current cell value.
 * - Collect all grid flips that should happen this step (a flip per ant on its current cell).
 * - Apply all flips to the grid (so flips are effectively atomic for this step).
 * - After flips are applied, move each ant according to its decided new direction and wrap.
 */
function stepOnce() {
  if (ants.length === 0) return;

  // Snapshot is not a deep copy of the grid array; we only need cell values at ants' positions
  const decisions = ants.map(a => {
    const cellColor = grid.getCell(a.x, a.y);
    // Determine new direction based on current cell color (0: turn right, 1: turn left)
    const newDir = cellColor === 0 ? (a.direction + 1) % 4 : (a.direction - 1 + 4) % 4;
    return { ant: a, newDir, x: a.x, y: a.y };
  });

  // Apply all flips for ants' current cells
  // Use a Set keyed by "x,y" so multiple ants on same cell flip multiple times (i.e., each ant flips once)
  const flipCounts = new Map();
  decisions.forEach(d => {
    const key = `${d.x},${d.y}`;
    flipCounts.set(key, (flipCounts.get(key) || 0) + 1);
  });

  // Now apply flips: an odd count -> flip, even count -> no net change
  flipCounts.forEach((count, key) => {
    if (count % 2 === 1) {
      const [sx, sy] = key.split(',').map(Number);
      grid.flipCell(sx, sy);
    }
  });

  // Finally, update ants' directions and positions based on previously computed newDir
  decisions.forEach(d => {
    const a = d.ant;
    a.direction = d.newDir;
    switch (a.direction) {
      case 0: a.y -= 1; break;
      case 1: a.x += 1; break;
      case 2: a.y += 1; break;
      case 3: a.x -= 1; break;
    }
    a.x = (a.x + gridSizeX) % gridSizeX;
    a.y = (a.y + gridSizeY) % gridSizeY;
  });

  // Draw grid and ants, update step counter
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