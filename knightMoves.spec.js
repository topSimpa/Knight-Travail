import knightMoves from "./knightMoves.js";

describe("testing knight travails", () => {
  test("test one [0,0] to [1, 2]", () => {
    expect(knightMoves([0, 0], [1, 2])).toStrictEqual([
      [0, 0],
      [1, 2],
    ]);
  });

  test("test four [0, 0] to [1, 0]", () => {
    expect(knightMoves([0, 0], [1, 0])).toStrictEqual([
      [0, 0],
      [2, 1],
      [0, 2],
      [1, 0],
    ]);
  });

  test("test five [3, 3] to [4, 3]", () => {
    expect(knightMoves([3, 3], [4, 3])).toStrictEqual([
      [3, 3],
      [5, 4],
      [3, 5],
      [4, 3],
    ]);
  });

  test("test two [0, 0] to [3, 3]", () => {
    const validOutput = [
      [
        [0, 0],
        [2, 1],
        [3, 3],
      ],
      [
        [0, 0],
        [1, 2],
        [3, 3],
      ],
    ];
    expect(validOutput).toContainEqual(knightMoves([0, 0], [3, 3]));
  });

  test("test three [0, 0] to [7, 7]", () => {
    const validOutput = [
      [
        [0, 0],
        [2, 1],
        [4, 2],
        [6, 3],
        [4, 4],
        [6, 5],
        [7, 7],
      ],
      [
        [0, 0],
        [2, 1],
        [4, 2],
        [6, 3],
        [7, 5],
        [5, 6],
        [7, 7],
      ],
    ];
    expect(validOutput).toContainEqual(knightMoves([0, 0], [7, 7]));
  });
});
