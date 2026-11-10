import "./reset.css";
import "./styles.css";
import DomController from "./knightTraivail.js";

const board = document.querySelector(".board");
const pieceBox = document.querySelector("div.pieces");
const showPathButton = document.querySelector("button#show");

const control = DomController(board, pieceBox);

showPathButton.addEventListener("click", control.clickShowPath);
