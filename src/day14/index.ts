import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n")
    .map((x) => x.split(""));

const CYCLES = 1_000_000_000;

function rebuildGrid(rawGrid: string) {
  return rawGrid
    .trim()
    .split("\n")
    .map((line) => line.split(""));
}

function rollToNorth(grid: string[][]) {
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      if (grid[row][column] !== "O") continue;
      let newRow = row - 1;
      while (newRow >= 0 && grid[newRow][column] === ".") newRow--;
      if (newRow < row - 1) {
        grid[newRow + 1][column] = "O";
        grid[row][column] = ".";
      }
    }
  }
  return grid;
}

function rollToWest(grid: string[][]): string[][] {
  for (let row = 0; row < grid.length; row++) {
    const line = grid[row];
    for (let column = 0; column < line.length; column++) {
      if (line[column] !== "O") continue;
      let newColumn = column - 1;
      while (newColumn >= 0 && line[newColumn] === ".") newColumn--;
      if (newColumn < column - 1) {
        line[newColumn + 1] = "O";
        line[column] = ".";
      }
    }
  }
  return grid;
}

function rollToSouth(grid: string[][]): string[][] {
  for (let row = grid.length - 1; row >= 0; row--) {
    const line = grid[row];
    for (let column = 0; column < line.length; column++) {
      if (line[column] !== "O") continue;

      let newRow = row + 1;
      while (newRow < grid.length && grid[newRow][column] === ".") newRow++;
      if (newRow > row + 1) {
        grid[newRow - 1][column] = "O";
        grid[row][column] = ".";
      }
    }
  }
  return grid;
}

function rollToEast(grid: string[][]): string[][] {
  for (let row = 0; row < grid.length; row++) {
    const line = grid[row];

    for (let column = line.length - 1; column >= 0; column--) {
      if (line[column] !== "O") continue;
      let newColumn = column + 1;
      while (newColumn < line.length && line[newColumn] === ".") newColumn++;
      if (newColumn > column + 1) {
        line[newColumn - 1] = "O";
        line[column] = ".";
      }
    }
  }
  return grid;
}

function roll(grid: string[][]): string[][] {
  return rollToEast(rollToSouth(rollToWest(rollToNorth(grid))));
}

function calculateScore(grid: string[][]): number {
  let lineScoreValue = grid.length;
  let score = 0;
  for (let row of grid) {
    const blocks = row.filter((c) => c === "O").length;
    const lineScore = blocks * lineScoreValue;
    score += lineScore;
    lineScoreValue--;
  }
  return score;
}

function serialize(grid: string[][]) {
  return grid.map((line) => line.join("")).join("\n");
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return calculateScore(rollToNorth(input));
};

const part2 = (rawInput: string) => {
  let grid = parseInput(rawInput);
  const history: string[] = [];
  let gridIndex = -1;
  for (let count = 0; count < CYCLES; count++) {
    const rawGrid = serialize(roll(grid));
    gridIndex = history.indexOf(rawGrid);
    // We've seen this grid before, we're in a cycle.
    if (gridIndex >= 0) break;
    history.push(rawGrid);
  }
  const gridCycleLength = history.length - gridIndex;
  const lastGridOnCycle =
    history[gridIndex + ((CYCLES - gridIndex) % gridCycleLength) - 1];

  return calculateScore(rebuildGrid(lastGridOnCycle));
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
