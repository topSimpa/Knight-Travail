import "./reset.css";
import "./styles.css";
import DomController from "./knightTraivail.js";

const board = document.querySelector(".board");
const pieceBox = document.querySelector("div.pieces");
const showPathButton = document.querySelector("button#show");
const resetButton = document.querySelector("button#reset");
const instruction = document.querySelector(".instruction");

const control = DomController(board, pieceBox, instruction);

showPathButton.addEventListener("click", control.clickShowPath);
resetButton.addEventListener("click", control.clickReset);
