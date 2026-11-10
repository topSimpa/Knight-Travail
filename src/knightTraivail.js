import GameController from "./logic/gameController.js";
import pawnImage from "./images/pawn.svg";
import knightImage from "./images/knight.svg";

export default function DomController(boardUI, piecesBox) {
  const game = new GameController();
  const pieceType = {
    pawn: "one",
    knight: "two",
  };

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

        inner.addEventListener("dragenter", dragEnterHandler);
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

  const clickShowPath = () => {
    if (!game.status) return;

    game.showPath();
    nextMove();
  };

  const dragKnight = (event) => dragPiece(event, pieceType.knight);

  const dragPawn = (event) => dragPiece(event, pieceType.pawn);

  const dragPiece = (event, type) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", type);
  };

  const dragEnterHandler = (event) => {
    const target = event.currentTarget;
    const cell = [Number(target.dataset.x), Number(target.dataset.y)];
    const nextCell = game.nextCell;
    console.log("drag--enter");
    console.log(game.status, nextCell);
    if (!(game.status || cellEqual(cell, nextCell))) {
      console.log("not dropabale");
      event.dataTransfer.dropEffect = "none";
      return;
    }
    event.dataTransfer.dropEffect = "move";
  };

  const dragOverHandler = (event) => {
    if (event.dataTransfer.dropEffect === "none") return;
    event.preventDefault();
  };

  const dragDropHandler = (event) => {
    event.preventDefault();
    const target = event.currentTarget;
    const data = event.dataTransfer.getData("text/plain");

    console.log(target);
    console.log(data);

    const dataset = target.dataset;
    if (data === pieceType.knight) {
      target.classList.add("knight");
      addPieces(pieceType.knight, target);
      game.knight = [Number(dataset.x), Number(dataset.y)];
    } else if (data === pieceType.pawn) {
      target.classList.add("pawn");
      addPieces(pieceType.pawn, target);
      game.pawn = [Number(dataset.x), Number(dataset.y)];
    }

    if (!game.status) (nextMove(), game.nextPath());
  };

  const dragEnd = (event) => {
    if (event.dataTransfer.dropEffect === "none") return;
    const target = event.currentTarget;
    const parent = target.parentNode;
    if (game.status) {
      switch (target.id) {
        case `piece-${pieceType.pawn}`:
          parent.classList.remove("pawn");
          break;
        case `piece-${pieceType.knight}`:
          parent.classList.remove("knight");
      }
    } else parent.classList.remove("next");
    target.remove();
    console.log(game._pawnCell, game._knightCell);
  };

  const nextMove = () => {
    const nextCell = game.nextCell;
    console.log(nextCell);
    if (nextCell.length === 0) return;

    const cell = document.querySelector(
      `[data-x="${nextCell[0]}"][data-y="${nextCell[1]}"]`,
    );

    console.log(cell);
    cell.classList.add("next");
  };

  buildBoard();

  return {
    clickShowPath,
  };
}
