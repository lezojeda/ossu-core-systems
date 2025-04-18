# Conway's Game of Life in Jack

[Preview in Youtube](https://www.youtube.com/watch?v=7qTTqfcPL-c)

This program is an implementation of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life), written in the Jack programming language for this module's project.

It simulates a cellular automaton where cells on a grid evolve based on simple rules, creating complex patterns over time.

## How it works

- **`ConwayLifeGame`**: The main class that ties everything together. It handles user input, runs the simulation, and manages the game state.
   **`Grid`**: Draws the graphical grid on the screen to visually separate the cells.
  - **`Selector`**: Allows the user to select and toggle individual cells before starting the simulation using the keyboard arrow keys and R or P to run or pause the simulation respectively.
 - **`CellGrid`**: Manages the grid of cells. It handles the initialization of cells, calculates the next state of the grid based on the Game of Life rules, and applies the new state to the cells.
- **`Cell`**: Represents an individual cell in the grid. Each cell has an `isAlive` state and knows how to toggle its state and draw itself on the screen.
- **`ScreenText`**: Displays messages on the screen, such as "paused" or "game running." An abstraction over the Jack out of the box `Screen` and `String` classes to write and erase a text in the top left of the screen.

## Cell size
The cell size is controlled through the `cellSize` field in the `ConwayLifeGame` class. The amount of rows, cols and hence cells are derived from it. Due to the VM emulator constraints and a heap overflow the minimum size is 8 with a default of 16. It must be one of: 8, 16, 32 or 64 to fit grid constraints.

## Rules of the Game

The Game of Life operates on a grid of cells, each of which can be alive or dead. The state of each cell evolves based on the following rules:
1. A live cell with fewer than 2 live neighbors dies (underpopulation).
2. A live cell with 2 or 3 live neighbors survives.
3. A live cell with more than 3 live neighbors dies (overpopulation).
4. A dead cell with exactly 3 live neighbors becomes alive (reproduction).

## Controls

- **Arrow Keys**: Move the selector to choose a cell.
- **Enter**: Toggle the state of the selected cell (alive or dead).
- **R/r**: Start the simulation.
- **P/p**: Pause the simulation. Hold the key since there may be a delay between the next state calculation and the program detecting the pressed key.
- **Q/q**: Quit the game.

## How to Run

1. Clone the repository
2. Load the folder, compile using the [NAND2Tetris Jack Compiler](https://nand2tetris.github.io/web-ide/compiler) and click run
3. Click in `Run`
![imagen](https://github.com/user-attachments/assets/53060521-72fb-4ba3-8217-1ba5e519b935)
4. The grid and the selector should be drawn in the screen, click where it says `Enable Keyboard`, below the screen and the selector should be movable. Try the following shapes and then press R to run the simulation:
![imagen](https://github.com/user-attachments/assets/d4ad462e-066e-4815-a031-97816b95b61a)

## File Structure

- `Cell.jack`: Defines the `Cell` class.
- `CellGrid.jack`: Defines the `CellGrid` class.
- `Grid.jack`: Defines the `Grid` class for drawing the grid.
- `Selector.jack`: Defines the `Selector` class for user interaction.
- `ConwayLifeGame.jack`: Defines the main game logic.
- `ScreenText.jack`: Handles text output on the screen.
- `Main.jack`: Entry point for the program.
