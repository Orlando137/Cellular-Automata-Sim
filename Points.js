// --- Constants ---
const canvas = document.getElementById('antCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 2; // Size of each cell in pixels

// Set canvas dimensions
canvas.width = 400;
canvas.height = 400;
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
        ctx.fillStyle = this.getCell(x, y) === 1 ? 'black' : 'white';
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
    // Check the color of the current cell
    const cellColor = grid.getCell(this.x, this.y);

    // Turn and flip the cell based on the color
    if (cellColor === 0) { // White cell
      this.direction = (this.direction + 1) % 4; // Turn right
    } else { // Black cell
      this.direction = (this.direction - 1 + 4) % 4; // Turn left
    }

    grid.flipCell(this.x, this.y);

    // Move the ant one step forward
    switch (this.direction) {
      case 0: this.y--; break; // North
      case 1: this.x++; break; // East
      case 2: this.y++; break; // South
      case 3: this.x--; break; // West
    }

    // Wrap around the edges of the grid
    this.x = (this.x + gridSizeX) % gridSizeX;
    this.y = (this.y + gridSizeY) % gridSizeY;
  }

  draw() {
    // Draw the ant as a small red square
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
  }
}

// --- Main Simulation Loop ---
const grid = new Grid(gridSizeX, gridSizeY);
const ant = new Ant(Math.floor(gridSizeX / 2), Math.floor(gridSizeY / 2));

function animate() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw the simulation
  ant.move();
  grid.draw();
  ant.draw();

  // Loop
  requestAnimationFrame(animate);
}

// Start the animation
animate();