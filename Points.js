// --- Constants ---
const start = document.getElementById('start');
const pause = document.getElementById('pause');
const reset = document.getElementById('reset');
const save = document.getElementById('save');
const canvas = document.getElementById('kansas');
const ctx = canvas.getContext('2d');
const cellSize = 3; // Size of each cell in pixels
var started = false;
var playing = false;

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
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.direction = 0; // 0: North, 1: East, 2: South, 3: West
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
      case 0: this.y--; break; // North
      case 1: this.x++; break; // East
      case 2: this.y++; break; // South
      case 3: this.x--; break; // West
    }

    this.x = (this.x + gridSizeX) % gridSizeX;
    this.y = (this.y + gridSizeY) % gridSizeY;
  }

  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
  }
}

const grid = new Grid(gridSizeX, gridSizeY);
const ant = new Ant(Math.floor(gridSizeX / 2), Math.floor(gridSizeY / 2));
ant.draw();

function animate() {
  ant.move();
  grid.draw();
  ant.draw();

  if (playing)
    requestAnimationFrame(animate);
}

//Control Buttons
start.onclick = () => {
    started = true;
    playing = true;
    animate();
}

pause.onclick = () => {playing? playing = false : playing = true; if (playing) animate();};

reset.onclick = () => {
  if (started) {
    started = false;
    playing = false;
    grid.grid = grid.createGrid();
    ant.x = Math.floor(gridSizeX / 2);
    ant.y = Math.floor(gridSizeY / 2);
    ant.direction = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ant.draw();
    requestAnimationFrame
  }
}

save.onclick = () => {
  const link = document.createElement("a");
  link.download = "pattern.png";
  link.href = canvas.toDataURL();
  link.click();
}