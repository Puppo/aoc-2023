import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => line.split(""));

type Direction = [number, number];
type Position = [number, number];

const Right = [0, 1] satisfies Direction;
const Left = [0, -1] satisfies Direction;
const Up = [-1, 0] satisfies Direction;
const Down = [1, 0] satisfies Direction;

type Beam = {
  direction: Direction;
  position: Position;
};

type ResultGrid = {
  cell: string;
  visited: Set<Direction>;
}[][];

function buildResultGrid(grid: string[][]): ResultGrid {
  return grid.map((row) =>
    row.map((cell) => ({
      cell,
      visited: new Set<Direction>(),
    })),
  );
}

function calculateBeamPath(grid: string[][], initBeam: Beam): ResultGrid {
  let beams: Beam[] = [initBeam];
  const resultGrid = buildResultGrid(grid);
  const maxRows = grid.length;
  const maxCols = grid[0].length;
  do {
    const nextBeams: Beam[] = [];
    // console.log(nextBeams.length)
    while (beams.length) {
      const currentBeam = beams.shift()!;
      const {
        position: [x, y],
        direction: [dx, dy],
      } = currentBeam;
      if (x < 0 || x >= maxRows || y < 0 || y >= maxCols) continue;

      const currentTile = grid[x][y];
      if (resultGrid[x][y].visited.has(currentBeam.direction)) continue;

      resultGrid[x][y].visited.add(currentBeam.direction);

      if (
        currentTile === "." ||
        (currentTile === "-" && Math.abs(dy) === 1) ||
        (currentTile === "|" && Math.abs(dx) === 1)
      ) {
        nextBeams.push({
          direction: [dx, dy],
          position: [x + dx, y + dy],
        });
      } else if (currentTile === "-") {
        nextBeams.push({
          direction: Right,
          position: [x + Right[0], y + Right[1]],
        });
        nextBeams.push({
          direction: Left,
          position: [x + Left[0], y + Left[1]],
        });
      } else if (currentTile === "|") {
        nextBeams.push({
          direction: Down,
          position: [x + Down[0], y + Down[1]],
        });
        nextBeams.push({
          direction: Up,
          position: [x + Up[0], y + Up[1]],
        });
      } else if (currentTile === "\\") {
        const newDirection: Direction = [dy, dx];
        nextBeams.push({
          direction: newDirection,
          position: [x + newDirection[0], y + newDirection[1]],
        });
      } else if (currentTile === "/") {
        const newDirection: Direction = [-dy, -dx];
        nextBeams.push({
          direction: newDirection,
          position: [x + newDirection[0], y + newDirection[1]],
        });
      }
    }
    // console.log(nextBeams.length)
    beams = nextBeams;
  } while (beams.length > 0);

  return resultGrid;
}

const calculateResult = (grid: ResultGrid) => {
  let result = 0;
  for (let x = 0; x < grid.length; x++) {
    const row = grid[x];
    for (let y = 0; y < row.length; y++) {
      const cell = row[y];
      if (cell.visited.size) result += 1;
    }
  }
  return result;
};

const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  const starts: Beam = {
    direction: Right,
    position: [0, 0],
  };

  const result = calculateBeamPath(grid, starts);

  return calculateResult(result);
};

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  const maxCols = grid[0].length;
  const maxRows = grid.length;

  const starts = [
    ...Array.from(
      { length: maxCols },
      (_, column): Beam => ({
        direction: Down,
        position: [0, column],
      }),
    ),
    ...Array.from(
      { length: maxCols },
      (_, column): Beam => ({
        direction: Up,
        position: [maxCols - 1, column],
      }),
    ),
    ...Array.from(
      { length: maxRows },
      (_, row): Beam => ({
        direction: Right,
        position: [row, 0],
      }),
    ),
    ...Array.from(
      { length: maxRows },
      (_, row): Beam => ({
        direction: Left,
        position: [row, maxCols - 1],
      }),
    ),
  ];

  return Math.max(
    ...starts.map((startsItem) =>
      calculateResult(calculateBeamPath(grid, startsItem)),
    ),
  );
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
