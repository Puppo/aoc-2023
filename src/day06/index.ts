import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const [times, distances] = rawInput
    .trim()
    .split("\n")
    .map((line) => line.slice(9).trim().split(/\s+/).map(Number));

  return { times, distances };
};

const countSolutions = (time: number, distance: number) => {
  const discr = (time * time - 4 * distance) ** 0.5;
  const x1 = (time + discr) / 2;
  const x2 = (time - discr) / 2;
  return Math.ceil(x1) - (x2 % 1 ? Math.ceil(x2) : discr + 1);
};

const part1 = (rawInput: string) => {
  const { times, distances } = parseInput(rawInput);

  const totalSolutions = times
    .map((time, index) => countSolutions(time, distances[index]))
    .reduce((prod, count) => prod * count);

  return totalSolutions;
};

const part2 = (rawInput: string) => {
  const { distances, times } = parseInput(rawInput);

  const bigTime = Number(times.join(""));
  const bigDistance = Number(distances.join(""));

  return countSolutions(bigTime, bigDistance);
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
