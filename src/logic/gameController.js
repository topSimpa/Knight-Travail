import knightMoves from "./knightMoves.js";
import { STATECODE } from "../constant.js";

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
      this.reset();
      return;
    }

    this.#currIndex++;
  }

  get status() {
    return this._status;
  }

  reset() {
    this._pawnCell = undefined;
    this._knightCell = undefined;
    this.toggleStatus();
    this._nextPath = [];
    this.#currIndex = 1;
  }

  state() {
    if (!this._knightCell) {
      return STATECODE.placeKnight;
    } else if (!this._pawnCell) {
      return STATECODE.placePawn;
    } else if (this.status) {
      return STATECODE.clickShowPath;
    } else if (this.#currIndex < this._nextPath.length) {
      return STATECODE.makeMove;
    } else return STATECODE.arrived;
  }

  showPath() {
    if (!(this._pawnCell && this._knightCell && this._status)) return false;

    this.toggleStatus();

    this._nextPath = knightMoves(this._knightCell, this._pawnCell);
    return true;
  }

  toggleStatus() {
    this._status = !this._status;
  }
}
