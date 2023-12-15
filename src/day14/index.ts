import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

function rollToNorth(grid: string[]) {
  for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
          if (grid[y][x] != 'O') continue;
          for (let i = 0; i < y; i++) {
              if ('#O'.includes(grid[y - i - 1][x])) break;
              grid[y - i] = grid[y - i].slice(0, x) + '.' + grid[y - i].slice(x + 1);
              grid[y - i - 1] = grid[y - i - 1].slice(0, x) + 'O' + grid[y - i - 1].slice(x + 1);
          }
      }
  }
  return grid;
}

function rollToWest(grid: string[]) {
  for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
          if (grid[y][x] != 'O') continue;
          for (let i = 0; i < x; i++) {
              if ('#O'.includes(grid[y][x - i - 1])) break;
              grid[y] = grid[y].slice(0, x - i - 1) + 'O.' + grid[y].slice(x - i + 1);
          }
      }
  }
  return grid;
}

function rollRocksEast(grid: string[]) {
  for (let y = 0; y < grid.length; y++) {
      for (let x = grid[0].length; x > 0; x--) {
          if (grid[y][x - 1] != 'O') continue;
          for (let i = 0; i < grid[0].length - x; i++) {
              if ('#O'.includes(grid[y][x + i])) break;
              grid[y] = grid[y].slice(0, x + i - 1) + '.O' + grid[y].slice(x + i + 1);
          }
      }
  }
  return grid;
}

function rollRocksSouth(grid: string[]) {
  for (let y = grid.length; y > 0; y--) {
      for (let x = 0; x < grid[0].length; x++) {
          if (grid[y - 1][x] != 'O') continue;
          for (let i = 0; i < grid[0].length - y; i++) {
              if ('#O'.includes(grid[y + i][x])) break;
              grid[y + i - 1] = grid[y + i - 1].slice(0, x) + '.' + grid[y + i - 1].slice(x + 1);
              grid[y + i] = grid[y + i].slice(0, x) + 'O' + grid[y + i].slice(x + 1);
          }
      }
  }
  return grid;
}

function calculateScore(pattern: string[]): number {
  let lineScore = pattern.length;
  let score = 0;
  for (let row of pattern) {
    const blocks = row.split('').filter(c => c === 'O').length;
    score += blocks * lineScore--;
  }

  return score;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return calculateScore(rollToNorth(input))
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let grid = input;
  for (let i = 0; i < 1_000_000_000; i++) {
    if (i % 1_000_000 === 0) console.log(i);
    grid = rollToNorth(grid);
    grid = rollToWest(grid);
    grid = rollRocksSouth(grid);
    grid = rollRocksEast(grid);
  }

  console.log(grid.join('\n'));

  return calculateScore(grid)
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
