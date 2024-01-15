import run from "aocrunner";

const directions = [
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
  [-1, 0], // up
] as const;

type Instruction = [number, number];

const parseInstructionPartOne = (input: string): Instruction[] =>
  input
    .trim()
    .split("\n")
    .map((line) => {
      const [dir, len] = line.split(" ");
      return ["URDL".indexOf(dir), Number(len)];
    });

const parseInstructionPartSecond = (input: string): Instruction[] =>
  input
    .trim()
    .split("\n")
    .map((line) => {
      const [, , inst] = line.split(" ");
      return [Number(inst[7]), Number("0x" + inst.slice(2, -2))];
    });

const getCoordsAdjustFn = (isClockwise: boolean) => {
  const parity = isClockwise ? -1 : 1;
  return (dir: number, nextDir: number) => {
    const dr = directions[dir][0] + directions[nextDir][0];
    const dc = directions[dir][1] + directions[nextDir][1];
    return [(dc + parity) / 2 / parity, (dr - parity) / -2 / parity];
  };
};

const calculateArea = (instructions: Instruction[]) => {
  /**
   * We're all about counting those cool clockwise 90° turns.
   * If we find more of those than the counter-clockwise ones,
   * it's like we're strolling through the polygon's border in a clockwise dance (and the difference is a multiple of 4).
   * It's all about making the right moves with our polygon's vertexes!
   */
  const clockwiseTurns = instructions.filter(([direction], index) =>
    [1, -3].includes(
      instructions[(index + 1) % instructions.length][0] - direction,
    ),
  ).length;
  const isClockwise = clockwiseTurns > instructions.length / 2;

  const getCoordsAdjust = getCoordsAdjustFn(isClockwise);

  const { coords } = instructions.reduce<{
    coords: [number, number][];
    row: number;
    column: number;
  }>(
    (acc, [direction, distance], index) => {
      const nextDir = instructions[(index + 1) % instructions.length][0];
      const coordAdjust = getCoordsAdjust(direction, nextDir);
      acc.row += directions[direction][0] * distance;
      acc.column += directions[direction][1] * distance;
      acc.coords.push([acc.row + coordAdjust[0], acc.column + coordAdjust[1]]);
      return acc;
    },
    {
      coords: [],
      row: 0,
      column: 0,
    },
  );

  // Shoelace Formula or Gauss's area formula
  // The shoelace formula, also known as Gauss's area formula and the surveyor's formula,
  // is a mathematical algorithm to determine the area of a simple polygon
  // whose vertices are described by their Cartesian coordinates in the plane.
  return (
    Math.abs(
      coords.reduce((sum, [row, col], index) => {
        const [nextRow, nextCol] = coords[(index + 1) % coords.length];
        return sum + row * nextCol - col * nextRow;
      }, 0),
    ) / 2
  );
};

const part1 = (rawInput: string) => {
  return calculateArea(parseInstructionPartOne(rawInput));
};

const part2 = (rawInput: string) => {
  return calculateArea(parseInstructionPartSecond(rawInput));
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
