//cell.js

export default class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.prevInPath = null;
  }

  compare(cellB) {
    if (!cellB) return false;
    return this.x === cellB.x && this.y === cellB.y;
  }
}
