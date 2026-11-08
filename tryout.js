const validity = (axis) => axis > 0 && axis < 8;

const validMoves = (cell) => {
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

    if (validity(x) && validity(y)) validCells.push({ x, y });
  }
  return validCells;
};

const cell = { x: 0, y: 0 };
console.log(validMoves(cell));
