import run from "aocrunner";

const cubes = {
  red: 12,
  green: 13,
  blue: 14,
};

const parseInputV1 = (rawInput: string) => {
  const rows = rawInput.split("\n");
  const possibleGames: number[] = [];
  let i = 0;
  start_position: while (i < rows.length) {
    const row = rows[i];
    const [game, subsets] = row.split(":");
    const gameWithoutSpaces = game.trim();
    const [, gameNumber] = gameWithoutSpaces.split(" ");
    const gameNumberNum = parseInt(gameNumber, 10);
    const subsetsArr = subsets.split(";");
    for (const subset of subsetsArr) {
      const colors = subset.split(",");
      for (const colorItem of colors) {
        const colorWithoutSpaces = colorItem.trim();
        const [count, color] = colorWithoutSpaces.split(" ");
        const countNum = parseInt(count, 10);
        if (cubes[color] < countNum) {
          i++;
          continue start_position;
        }
      }
    }

    possibleGames.push(gameNumberNum);
    i++;
  }

  return possibleGames;
};

const parseInputV2 = (rawInput: string) => {
  const rows = rawInput.split("\n");
  const results: number[] = [];
  for (const row of rows) {
    const [, subsets] = row.split(":");
    const subsetsArr = subsets.split(";");
    const cubes = {
      red: -1,
      green: -1,
      blue: -1,
    };
    for (const subset of subsetsArr) {
      const colors = subset.split(",");
      for (const colorItem of colors) {
        const colorWithoutSpaces = colorItem.trim();
        const [count, color] = colorWithoutSpaces.split(" ");
        const countNum = parseInt(count, 10);
        const currentCount = cubes[color];
        if (currentCount === -1) {
          cubes[color] = countNum;
        } else if (currentCount < countNum) {
          cubes[color] = countNum;
        }
      }
    }

    results.push(Object.values(cubes).reduce((acc, curr) => acc * curr, 1));
  }

  return results;
};

const sum = (arr: number[]) => arr.reduce((acc, curr) => acc + curr, 0);

const part1 = (rawInput: string) => {
  const input = parseInputV1(rawInput);

  return sum(input);
};

const part2 = (rawInput: string) => {
  const input = parseInputV2(rawInput);

  return sum(input);
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
