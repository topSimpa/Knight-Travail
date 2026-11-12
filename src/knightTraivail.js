import GameController from "./logic/gameController.js";
import { STATECODE } from "./constant.js";
import pawnImage from "./images/pawn.svg";
import knightImage from "./images/knight.svg";

export default function DomController(boardUI, piecesBox, instruction) {
  const game = new GameController();
  const pieceType = {
    pawn: "one",
    knight: "two",
  };

  let moveCount = 0;

  const addPieces = (type, target) => {
    const piece = document.createElement("img");

    switch (type) {
      case pieceType.knight:
        piece.src = knightImage;
        piece.id = `piece-${pieceType.knight}`;
        piece.addEventListener("dragstart", dragKnight);
        break;
      case pieceType.pawn:
        piece.src = pawnImage;
        piece.id = `piece-${pieceType.pawn}`;
        piece.addEventListener("dragstart", dragPawn);
    }

    piece.classList.add("chess-piece");
    piece.addEventListener("dragend", dragEnd);
    target.append(piece);
  };

  const buildBoard = () => {
    const { row, col } = game.board();
    let rowIndex = 0;

    while (rowIndex < row) {
      let colIndex = 0;
      while (colIndex < col) {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        const inner = document.createElement("div");
        inner.dataset.x = rowIndex;
        inner.dataset.y = colIndex;
        inner.classList.add("inner");
        if ((colIndex + rowIndex) % 2 === 0) {
          inner.classList.add("inner-white");
        }

        // inner.addEventListener("dragenter", dragEnterHandler);
        inner.addEventListener("dragover", dragOverHandler);
        inner.addEventListener("drop", dragDropHandler);
        cell.append(inner);
        boardUI.append(cell);
        colIndex++;
      }
      rowIndex++;
    }

    addPieces(pieceType.knight, piecesBox);
    addPieces(pieceType.pawn, piecesBox);
  };

  const cellEqual = (cellA, cellB) =>
    cellA[0] === cellB[0] && cellA[1] == cellB[1];

  const clickReset = () => {
    if (game.state() === STATECODE.placeKnight) return;
    const pieces = document.querySelectorAll(".chess-piece");
    const knightPath = document.querySelectorAll(".knight-visited");
    const pawnPath = document.querySelectorAll(".pawn-visited");
    const nextPath = document.querySelectorAll(".next");

    pieces.forEach((piece) => piece.remove());
    knightPath.forEach((point) => {
      point.classList.remove("knight-visited");
      point.textContent = "";
    });
    pawnPath.forEach((point) => point.classList.remove("pawn-visited"));
    nextPath.forEach((point) => {
      point.classList.remove("next");
      point.textContent = "";
    });

    addPieces(pieceType.knight, piecesBox);
    addPieces(pieceType.pawn, piecesBox);
    moveCount = 0;
    game.reset();
    stateReport();
  };

  const clickShowPath = () => {
    stateReport();
    if (game.state() !== STATECODE.clickShowPath) return;
    if (game.showPath()) {
      nextMove();
      togglePawnDragAbility(false);
    }
  };

  const dragKnight = (event) => dragPiece(event, pieceType.knight);

  const dragPawn = (event) => dragPiece(event, pieceType.pawn);

  const dragPiece = (event, type) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", type);
  };

  const dragOverHandler = (event) => {
    const target = event.currentTarget;
    const cell = [Number(target.dataset.x), Number(target.dataset.y)];
    const nextCell = game.nextCell;
    const isPlacingPieces = game.state() <= STATECODE.clickShowPath;
    if (!(isPlacingPieces || cellEqual(cell, nextCell))) {
      event.dataTransfer.dropEffect = "none";
      return;
    }
    event.preventDefault();
  };

  const dragDropHandler = (event) => {
    const target = event.currentTarget;

    const data = event.dataTransfer.getData("text/plain");

    const dataset = target.dataset;
    //if there is a piece in that cell remove
    //this only happens when a pawn is found
    const previousPiece = target.querySelector(".chess-piece");
    if (previousPiece) {
      previousPiece.remove();
      addPieces(pieceType.pawn, piecesBox);
    }
    if (data === pieceType.knight) {
      target.classList.add("knight-visited");
      addPieces(pieceType.knight, target);
      game.knight = [Number(dataset.x), Number(dataset.y)];
    } else if (data === pieceType.pawn) {
      target.classList.add("pawn-visited");
      addPieces(pieceType.pawn, target);
      game.pawn = [Number(dataset.x), Number(dataset.y)];
    }

    if (!game.status) (game.nextPath(), nextMove());
    event.preventDefault();
    stateReport();
  };

  const dragEnd = (event) => {
    if (event.dataTransfer.dropEffect === "none") return;
    const target = event.currentTarget;
    const parent = target.parentNode;

    //removing piece from previous on successful drop
    if (game.state() <= STATECODE.clickShowPath) {
      //only show visited path when in path moving
      //not for placing pieces
      switch (target.id) {
        case `piece-${pieceType.pawn}`:
          parent.classList.remove("pawn-visited");
          break;
        case `piece-${pieceType.knight}`:
          parent.classList.remove("knight-visited");
      }
    } else {
      parent.classList.remove("next");
      parent.append(moveCount++);
    }
    target.remove();
    stateReport();
  };

  const nextMove = () => {
    const nextCell = game.nextCell;
    if (nextCell.length === 0) return;

    const cell = document.querySelector(
      `[data-x="${nextCell[0]}"][data-y="${nextCell[1]}"]`,
    );

    cell.classList.add("next");
  };

  const stateReport = () => {
    const span = document.createElement("span");
    let reset = document.createElement("span");
    switch (game.state()) {
      case STATECODE.placeKnight:
        span.textContent = state_message.knight;
        span.classList.add("grey");
        break;
      case STATECODE.placePawn:
        span.textContent = state_message.pawn;
        span.classList.add("grey");
        break;
      case STATECODE.clickShowPath:
        span.textContent = state_message.clickShowPath;
        span.classList.add("green");
        break;
      case STATECODE.makeMove:
        span.textContent = state_message.makeMove;
        span.classList.add("green");
        break;
      case STATECODE.arrived:
        span.textContent = state_message.arrived;
        span.classList.add("green");
        reset.textContent = state_message.reset;
        reset.classList.add("red");
        span.append(reset);
    }

    instruction.textContent = "";
    instruction.append(span);
  };

  const togglePawnDragAbility = (bool) => {
    const pawn = document.querySelector(`#piece-${pieceType.pawn}`);
    pawn.draggable = bool;
  };

  buildBoard();

  return {
    clickShowPath,
    clickReset,
  };
}

const state_message = {
  knight: "drag the knight piece to any square on the board",
  pawn: "drag the pawn piece to any square on the board",
  makeMove: "move knight to the other light green square",
  clickShowPath: "click show path",
  arrived: "checkMate! we followed the shortest path. ",
  reset: "want another set, reset",
};
