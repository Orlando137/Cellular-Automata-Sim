# Cellular Automata Studio (CAS)

## **Abstract**

**Cellular Automata Studio (CAS)** is an interactive, browser-based
environment for exploring, visualizing, and experimenting with
multi-state cellular automata. The tool provides a flexible
rule-definition interface, real-time simulation controls, manual grid
editing, crosshair-based precision editing, automatic and manual agent
("auto") placement, and a notepad for storing custom rules.

CAS supports **three rule systems**---color, turn, and distance---each
represented by eight-digit codes mapped to cell colors. These give users
deep control over the behavior of agents and the evolution of the grid.
CAS is designed for learners, researchers, artists, and hobbyists
interested in emergent complexity.

------------------------------------------------------------------------

# **Table of Contents**

1.  [Abstract](#abstract)\
2.  [Features](#features)\
3.  [How to Access the Project](#how-to-access-the-project)\
4.  [Getting Started](#getting-started)\
5.  [User Interface Overview](#user-interface-overview)\
6.  [Simulation Concepts](#simulation-concepts)\
7.  [Controls and Instructions](#controls-and-instructions)\
8.  [Rule System](#rule-system)\
9.  [Grid Editing](#grid-editing)\
10. [Crosshair Mode](#crosshair-mode)\
11. [Saving Images & Rules](#saving-images--rules)\
12. [How to Extend the Project](#how-to-extend-the-project)\
13. [Known Limitations](#known-limitations)\

------------------------------------------------------------------------

# **Features**

-   Interactive grid-based cellular automata simulation
-   Multiple autonomous agents ("autos")\
-   Independent rule codes for:
    -   **Color transformation**
    -   **Direction change**
    -   **Movement distance**
-   Random rule generation (4-mode and 8-mode)
-   Manual or automatic placement of autos
-   Cell painting mode for constructing initial conditions
-   Crosshair mode for keyboard-based precision editing
-   Step-by-step execution or continuous play
-   Rule saving, previewing, implementing, and notepad storage
-   Export simulation canvas as a PNG
-   Fully client-side; no installation required

------------------------------------------------------------------------

# **How to Access the Project**

### **Method 1 --- Open the HTML File**

Simply open **CAS.html** in your web browser.

### **Method 2 --- Run a Local Server**

Some browsers restrict local file access; a server is recommended.

**Python:**

``` bash
python3 -m http.server
```

Visit:

    http://localhost:8000

### **Method 3 --- Deploy Online**

Upload to any static hosting service:

-   GitHub Pages\
-   Netlify\
-   Vercel\
-   Cloudflare Pages

No backend required.

------------------------------------------------------------------------

# **Getting Started**

1.  Open **CAS.html** in your browser.
2.  Use the **Flow Control** panel to start or step through the
    simulation.
3.  Add autos or paint cells using the **Build Control** panel.
4.  Modify rule codes in the **Rule Panel** to change automata behavior.
5.  Watch emergent patterns evolve on the canvas.

------------------------------------------------------------------------

# **User Interface Overview**

### **Left Panel --- Flow & Build Controls**

-   Start, Reset, Pause, Step
-   Auto placement vs. cell painting mode
-   Change auto direction
-   Kill all autos
-   Cycle paint colors
-   Rule notepad

### **Center --- Canvas**

-   Displays the grid and all autos
-   Click actions vary depending on mode:
    -   Add/remove autos
    -   Paint cells
    -   Right-click an auto to view its rule set

### **Right Panel --- Rule Controls**

-   Edit color, turn, and distance codes
-   Generate random rules
-   Save/preview rule sets
-   Export canvas as PNG
-   Implement rules from text input

------------------------------------------------------------------------

# **Simulation Concepts**

## **Autos**

Autos execute the following sequence:

1.  Read current cell's color\
2.  Apply turn code to change direction\
3.  Apply distance code to determine movement\
4.  Flip/transform the cell using the color code\
5.  Move to a new cell (with wrapping around edges)

## **Cells**

Cells display color values **0--7**:

  Value   Color
  ------- ---------
  0       Black
  1       Red
  2       Yellow
  3       Green
  4       Cyan
  5       Blue
  6       Magenta
  7       White

------------------------------------------------------------------------

# **Controls and Instructions**

## **Flow Controls**

  Button           Action
  ---------------- ----------------------------------
  **Start**        Begins the simulation
  **Reset**        Resets grid, autos, and counters
  **Pause/Play**   Toggles simulation
  **Step**         Performs exactly one update

------------------------------------------------------------------------

## **Build Controls**

### **Modes**

-   **Auto mode:** Click to add/remove autos
-   **Cell mode:** Click to paint cells

Toggle using **auto / cell** button.

### **Direction Button**

Cycles through:

    North → East → South → West

### **Kill**

Removes all autos.

### **Paint Color**

Cycles through colors 0--7 when in cell mode.

------------------------------------------------------------------------

# **Rule System**

Each rule is represented by an **8-digit code**, where each digit
corresponds to the behavior when an auto is standing on a cell of that
color.

Example:

    12345670 | 02461357 | 11212122

## **Color Code (0--8)**

Controls cell transformation.

-   `0–7` → Set cell to that color
-   `8` → Random color (0--7)

## **Turn Code (0--9)**

Controls the auto's rotation.

-   `0–7` → Add this value to direction (mod 8)
-   `8` → Random direction (0--7)
-   `9` → Special even-only random rotation

## **Distance Code (0--9)**

Controls how far the auto moves.

-   `1+` → Move exactly that many cells
-   `0` → Random distance of 1--2

------------------------------------------------------------------------

# **Grid Editing**

## **Cell Mode**

-   Click to paint cells
-   Cycle color with the **color** button
-   Useful for drawing patterns or constructing initial states

## **Auto Mode**

-   Click to add/remove autos
-   Right-click an auto to view its rule codes

------------------------------------------------------------------------

# **Crosshair Mode**

A precision editing mode.

### **Enable**

Click **crosshair**.

### **Controls**

-   **W / A / S / D** or arrow keys → Move crosshair\
-   **0--7** → Paint the current cell\
-   Current cell is highlighted for visibility

------------------------------------------------------------------------

# **Saving Images & Rules**

## **Save Canvas as PNG**

1.  Enter a graph name
2.  Click **save**
3.  PNG downloads automatically

## **Save Current Rule**

Displays the active rule set.

## **Add Rule to Notepad**

Stores rule text for later reference.

## **Implement A Rule**

Paste rule text like:

    12345670 | 02461357 | 11212122

CAS automatically loads it into the rule fields.

------------------------------------------------------------------------

# **Known Limitations**

-   No undo/redo
-   Fixed canvas size (600×600 px)
-   Autos can visually overlap
-   Multiple autos cannot change a tile at once
-   Rule codes must be 8 digits
-   Notepad does not auto-save between sessions
