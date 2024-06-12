const GRID_SIZE = 4;
const CELL_SIZE = "20vmin";

export class Grid {
  constructor(grid) {
    grid.style.setProperty("--cell-size", CELL_SIZE);
    grid.style.setProperty("--grid-size", GRID_SIZE);
    this.gridElement = grid;
    this.cells = generateCells(grid);
  }

  rowsGroup() {
    const rows = [];

    for (let i = 0; i < GRID_SIZE; i++) {
      rows.push([]);
    }

    this.cells.forEach((cell, index) => {
      rows[Math.floor(index / GRID_SIZE)].push(cell);
    });

    return rows;
  }

  columnsGroup() {
    const columns = [];

    for (let i = 0; i < GRID_SIZE; i++) {
      columns.push([]);
    }

    this.cells.forEach((cell, index) => {
      columns[index % GRID_SIZE].push(cell);
    });

    return columns;
  }

  randomCell() {
    const emptyCells = this.cells.filter((cell) => cell.tile == null);
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }
}

function generateCells(grid) {
  const cells = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    const cell = new Cell(
      cellElement,
      i % GRID_SIZE,
      Math.floor(i / GRID_SIZE)
    );
    cells.push(cell);
    grid.appendChild(cell.cellElement);
  }
  return cells;
}

class Cell {
  #tile;

  constructor(cell, x, y) {
    cell.style.setProperty("--x", x);
    cell.style.setProperty("--y", y);
    this.cellElement = cell;
    this.x = x;
    this.y = y;
  }

  get tile() {
    return this.#tile;
  }

  set tile(value) {
    this.#tile = value;
    if (value == null) return;
    this.#tile.x = this.x;
    this.#tile.y = this.y;
  }
}
