//knightMoves.js
import Cell from "./cell.js";

export default function knightMoves(start, end) {
  const knightCell = new Cell(...start);
  const pawnCell = new Cell(...end);

  const path = findPath(knightCell, pawnCell);
  return pathToList(path);
}

const pathToList = (path) => {
  if (!path) return [];

  const prevCells = pathToList(path.prevInPath);
  prevCells.push([path.x, path.y]);

  return prevCells;
};

//breadth-first search
const findPath = (knightCell, pawnCell) => {
  const searchQueue = [knightCell]; //bfs queue
  let currentIndex = 0;

  while (searchQueue[currentIndex]) {
    const currCell = searchQueue[currentIndex++];

    if (currCell.compare(pawnCell)) return currCell;
    searchQueue.push(...validMoves(currCell));
  }
};

const validity = (axis) => axis >= 0 && axis < 8;

const validMoves = (cell) => {
  //returns the valid knigth moves at a current cell.
  const moves = [
    [2, 1], // first index is horizontal and second is vertical
    [2, -1], // -negative vert is down and positive is up
    [-2, 1], // positive hor is right and negative is left
    [-2, -1],
    [1, 2],
    [-1, 2],
    [1, -2],
    [-1, -2],
  ];

  const validCells = [];

  for (let move of moves) {
    const x = cell.x + move[0];
    const y = cell.y + move[1];

    if (validity(x) && validity(y)) {
      const newCell = new Cell(x, y);
      newCell.prevInPath = cell; //doing this for mapping path
      if (!newCell.compare(cell.prevInPath)) validCells.push(newCell);
    }
  }
  return validCells;
};

// const cell = new Cell(0, 0);
// console.log(validMoves(cell));
