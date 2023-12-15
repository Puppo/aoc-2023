import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const [moves, rawNodes] = rawInput.trim().split("\n\n");
  const nodes = rawNodes
    .split("\n")
    .reduce<Record<string, [string, string]>>((nodeMap, line) => {
      nodeMap[line.slice(0, 3)] = [line.slice(7, 10), line.slice(12, 15)];
      return nodeMap;
    }, {});

  return { moves, nodes };
};

const countMoves =
  (moves: string, nodes: Record<string, [string, string]>) =>
  (start: string) => {
    let count = 0;
    let current = start;
    while (current[2] !== "Z") {
      const move = moves[count % moves.length];
      current = nodes[current][move === "R" ? 1 : 0];
      count++;
    }
    return count;
  };

const part1 = (rawInput: string) => {
  const { moves, nodes } = parseInput(rawInput);

  return countMoves(moves, nodes)("AAA");
};

const part2 = (rawInput: string) => {
  const { moves, nodes } = parseInput(rawInput);

  const ghostStarts = Object.keys(nodes).filter((node) => node[2] === "A");
  const ghostPathLengths = ghostStarts.map(countMoves(moves, nodes));

  const syncedGhostCycleLength =
    ghostPathLengths.reduce(
      (prod, length) => (prod * length) / moves.length,
      1,
    ) * moves.length;

  return syncedGhostCycleLength;
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
