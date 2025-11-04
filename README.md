# General Information
**Automata create patterns from observing colors and reacting. Discover how the emerging complexity of cellular automation today.**

## 🚀 Introduction  
This project simulates "autos" that evolve over time and affect "tiles" based on the states of their environment and some rules. With this simulation, you can define how spefic automata interact, where and when they begin, as well as their orientation. explore how predictable local interactions generate complex global behavior.

## 🛠️ Built With  
- HTML (front end)  
- CSS (styling)  
- JavaScript (logic & simulation)  
- Web APIs (e.g., requestAnimationFrame, canvas)  

## 🧭 Features  
- A grid of colored cells that evolve over discrete time steps.  
- Rules that define changes in color, direction, and location.  
- Real-time visualization in the browser (see `Points.html`, `Points.css`, `Points.js`).  
- Easy to tweak parameters and observe emergent patterns.

## 📁 Getting Started  
### Prerequisites  
- A modern web browser (Google Chrome, Firefox, Edge, etc.)  
- (Optional) A local web-server to serve files if you run into cross-origin issues (e.g., `python3 -m http.server`).  

### Installation & Running  
1. Clone this repository:  
   ```bash
   git clone https://github.com/Orlando137/Cellular-Automata-Sim.git

# Specific Information
**Beyond general information about the field, understanding the UI is just as important**

## Left Side
### Flow Control
- Press `start` to begin simulating, or press `step`.
- Press `pause` to stop simulating.
- Press `play` to resume simulating, or `reset` to start over.
- The number to the right counts how many timesteps have happened in the simulation.

- When no autos exist, the simulation will not run.

### Build Control
- The button that reads `north` can be pressed, and will cycle through the cardinal directions
- When the farthest left button reads `auto`, auto building mode is enabled
- The farthest left button can be toggled to read `cell`, which enables cell mode.
- In cell mode, the middle button contols the color to be built in cell mode.
- The `kill` button removes all autos on the screen.

### Notepad
The notepad is there simply for the convienence of the user. I recommend using it to store good rules.

## Right Side
### Saving the Graph
- Enter a name into the graph, then press the `save` button.
- The state of the central canvas is saved as a PNG.file.

### Control
- `color code` determines how an auto changes the tile color.
- The position of each digit represents the initial color.
- The value of each digit represents the final color.

- `turn code` determines how an auto changes direction.
- The position of each digit represents the initial color.
- Values 0 through 3 determine how many right angle clockwise turns the auto makes.
- Values 4 through 7 determine cardinal directions, north through west.

- `distance code` determines how an auto changes loctaion.
- The position of each digit represents the initial color.
- The value of each digit represents how many tiles the auto will move.

### Random Rules
- `color` generates a valid random code
- It will never begin with 0.

- `turn` generates a valid turn code.
- It will never begin with 0.
- It will only contain values from 0 to 3.

- `distance` generates a valid distance code.
- All values will be either 1 or 2.

- `all` has the functionality of `color`, `turn`, and `distance` combined.

- NOTE: Pressing these buttons directly change the input field of the codes!

### Finding Rules
Right click on an auto to display the rule in `rule:`.

### Entering Rules
- Copy the desired rule IN THE DEFUALT FORMAT, then press `go`.

- NOTE: Pressing `go` directly ghanges the input field of the codes!

## Graph
- In `auto` mode, clicking on a tile will add an auto with the given direction.
- In `cell` mode, clicking on a tile change the cell's color to the given color.
- In any mode, right-clicking on an auto will find that auto's rules

- At start or upon reset, an auto will be put in the middle of the graph with the current rule.

## 📜 Conventions
- An auto's rules are final and are set at instantiation.
- The auto reads the tile, then uses that to turn THEN move.
- Black, red, yellow, green, cyan, blue, and magenta are represented as 0 ... 6.
- When multiple autos are on the same tile, the tile will not change color when they move.

# 💡 Tips
## Graph
- Try updating the text in `rule: ` by clicking left, right, left on the graph.
- If an auto gets in a loop, then try going into `cell mode` and adding black to the loop.

## Rules
- Try making a system to qualitively describe the behavior of an auto
- When a value is the same as it's index in `color code`, it can lead to weird things.

## Behaviors
Here is a list of some behaviors you may encounter:
- Infinite loops
- Highways
- Psuedo chaos
- Diamonds
- "Solid" structure
- "Porus" structure
- Border colors
- Internal colors
- Solid internal color
- Mixed internal color
- Doublesided highways
- Time-keepers
- Slow growth
- Fast growth
