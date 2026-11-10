import knightMoves from "./knightMoves.js";

export default class GameController {
  #row = 8;
  #col = 8;
  #currIndex = 1;

  constructor() {
    this._pawnCell;
    this._knightCell;
    this._status = true;
    this._nextPath = [];
  }

  set knight(arr) {
    this._knightCell = arr;
  }

  set pawn(arr) {
    this._pawnCell = arr;
  }

  board() {
    return { row: this.#row, col: this.#col };
  }

  get nextCell() {
    return this._nextPath[this.#currIndex] || [];
  }

  nextPath() {
    if (this._nextPath.length === 0) return;

    if (this.#currIndex >= this._nextPath.length) {
      this.#currIndex = 1;
      this._nextPath = [];
      return;
    }

    this.#currIndex++;
  }

  get status() {
    return this._status;
  }

  showPath() {
    if (!this._status) throw new Error("Controller busy");

    if (!(this._pawnCell && this._knightCell)) {
      throw new Error("pawn or knight position invalid");
    }

    this.toggleStatus();

    this._nextPath = knightMoves(this._pawnCell, this._knightCell);
  }

  toggleStatus() {
    this._status = !this._status;
  }
}
