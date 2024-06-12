import { Grid } from "./grid.js";
import { Tile } from "./tile.js";

const gameBoard = document.querySelector("#game-board");

const grid = new Grid(gameBoard);
grid.randomCell().tile = new Tile(gameBoard);
grid.randomCell().tile = new Tile(gameBoard);

setupInput();

function setupInput() {
  document.addEventListener("keydown", handleUserInput, { once: true });
}

function handleUserInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (canMoveUp()) moveUp();
      break;
    case "ArrowDown":
      if (canMoveDown()) moveDown();
      break;
    case "ArrowLeft":
      if (canMoveLeft()) moveLeft();
      break;
    case "ArrowRight":
      if (canMoveRight()) moveRight();
      break;
    default:
      setupInput();
      return;
  }

  if (checkWin() || checkLose()) return;

  updateRound();
  setupInput();
}

function checkWin() {
  if (
    grid
      .columnsGroup()
      .some((group) => group.some((cell) => cell.tile?.value === 1024))
  ) {
    alert("You Won");
    return;
  }
}

function checkLose() {
  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    alert("You lost");
    return;
  }
}

function updateRound() {
  grid.columnsGroup().forEach((colum) => {
    colum.forEach((cell) => {
      if (cell.tile != null) cell.tile.hasBeenMerged = false;
    });
  });
}

function canMove(groups) {
  let moved = false;

  groups.map((group) => {
    for (let cellIndex = 0; cellIndex < group.length; cellIndex++) {
      const cell = group[cellIndex];
      const cellToMove = findCellToMove(group, cellIndex);

      if (cellIndex > 0 && cell.tile && cellToMove != null) {
        moved = true;
        break;
      }
    }
  });

  return moved;
}

function move(groups, axe) {
  groups.map((group) => {
    for (let cellIndex = 0; cellIndex < group.length; cellIndex++) {
      const cell = group[cellIndex];
      const cellToMove = findCellToMove(
        group,
        cellIndex,
        cell.tile?.hasBeenMerged
      );

      if (cellIndex > 0 && cell.tile && cellToMove != null) {
        const tile = cell.tile;
        tile[axe] = cellToMove[axe];

        if (cellToMove.tile != null) {
          cellToMove.tile.remove();
          tile.value = 2 * tile.value;
          tile.hasBeenMerged = true;
          cell.tile = null;
          cellToMove.tile = tile;
        } else {
          cell.tile = null;
          cellToMove.tile = tile;
        }
      }
    }
  });

  gameBoard.addEventListener("transitionend", remove, { once: true });
  grid.randomCell().tile = new Tile(gameBoard);
}

function findCellToMove(group, cellIndex, hasBeenMerged) {
  let cellToMove = null;

  for (
    let cellToMoveIndex = 0;
    cellToMoveIndex < cellIndex;
    cellToMoveIndex++
  ) {
    if (group[cellToMoveIndex].tile == null && cellToMove == null) {
      cellToMove = group[cellToMoveIndex];
    }

    if (
      group[cellToMoveIndex].tile?.value == group[cellIndex].tile?.value &&
      !hasBeenMerged &&
      !group[cellToMoveIndex].tile?.hasBeenMerged &&
      cellToMove == null
    ) {
      let pathIsFree = true;
      for (let i = cellToMoveIndex + 1; i < cellIndex; i++) {
        if (group[i].tile != null) {
          pathIsFree = false;
        }
      }

      if (pathIsFree) cellToMove = group[cellToMoveIndex];
    }
  }

  return cellToMove;
}

function remove() {
  const tilesToDelete = document.querySelectorAll(".to-remove");

  tilesToDelete.forEach((tile) => tile.remove());
}

function canMoveUp() {
  return canMove(grid.columnsGroup(), "x");
}

function canMoveDown() {
  return canMove(
    grid.columnsGroup().map((colum) => colum.reverse()),
    "x"
  );
}

function canMoveLeft() {
  return canMove(grid.rowsGroup(), "y");
}

function canMoveRight() {
  return canMove(
    grid.rowsGroup().map((row) => row.reverse()),
    "y"
  );
}

function moveUp() {
  move(grid.columnsGroup(), "y");
}

function moveDown() {
  move(
    grid.columnsGroup().map((colum) => colum.reverse()),
    "y"
  );
}

function moveLeft() {
  move(grid.rowsGroup(), "x");
}

function moveRight() {
  move(
    grid.rowsGroup().map((row) => row.reverse()),
    "x"
  );
}
