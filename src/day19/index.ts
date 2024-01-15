import run from "aocrunner";

type Branches = {
  prop: string;
  operator: string;
  value: number;
  destination: string;
}[];
type Workflow = {
  branches: Branches;
  elseDest: string;
};
type Workflows = Record<string, Workflow>;

type Part = { x: number; m: number; a: number; s: number };
type Ranges = { x: [number, number]; m: [number, number]; a: [number, number]; s: [number, number] };

const neg = { '<': '>=', '>': '<=' } as const;
type Operator = '<' | '>' | '<=' | '>=';

const MAX_VALUE = 4000;

type ConstraintProp = keyof Part;

type Constraint = {
  prop: ConstraintProp;
  operator: Operator;
  value: number;
};

function isOperatorWithoutEqual(value: string): value is Exclude<Operator, '<=' | '>='> {
  return ['<', '>'].includes(value);
}

function isConstraintProp(value: string): value is ConstraintProp {
  return ['x', 'm', 'a', 's'].includes(value);
}

const parseWorkflows = (rawInput: string): Workflows => {
  return rawInput
    .slice(0, rawInput.indexOf("\n\n"))
    .split("\n")
    .reduce<Workflows>((map, line) => {
      const [name, rest] = line.split("{");
      const chunks = rest.slice(0, -1).split(",");
      const branches = chunks.slice(0, -1).map((chunk) => {
        const prop = chunk[0];
        const operator = chunk[1];
        const value = Number(chunk.slice(2, chunk.indexOf(":")));
        const destination = chunk.slice(chunk.indexOf(":") + 1);
        return { prop, operator, value, destination };
      });
      const elseDest = chunks.at(-1)!;
      map[name] = { branches, elseDest };
      return map;
    }, {});
};

const parseParts = (input: string) =>
  input
    .slice(input.indexOf("\n\n") + 2)
    .trim()
    .split("\n")
    .map((line) =>
      JSON.parse(line.replace(/([{,])/g, '$1"').replaceAll("=", '":')),
    );

const isAcceptable = (workflows: Workflows) => (part: Part) => {
  let workflowName = "in";
  while (workflowName !== "A" && workflowName !== "R") {
    const { branches, elseDest } = workflows[workflowName];
    workflowName = elseDest;
    for (const { prop, operator, value, destination } of branches) {
      if (prop === "x" || prop === "m" || prop === "a" || prop === "s") {
        if (
          (operator === "<" && part[prop] < value) ||
          (operator === ">" && part[prop] > value)
        ) {
          workflowName = destination;
          break;
        }
      }
    }
  }
  return workflowName === "A";
};

const getPartValue = (part: Part) =>
  Object.values(part).reduce((sum, value) => sum + value);


const computePaths = (workflows: Workflows) => {
  let frontier = new Map<string, Constraint[]>([['in', []]]);
  const acceptableConstraints: Constraint[][] = [];

  while (frontier.size) {
    const newFrontier = new Map();
    for (const [name, constraints] of frontier) {
      const { branches, elseDest } = workflows[name];
      const prevConstraints = [...constraints];
      for (const { prop, operator, value, destination } of branches) {
        if (destination === 'A') {
          if (isConstraintProp(prop) && isOperatorWithoutEqual(operator))
            acceptableConstraints.push([
              ...prevConstraints,
              { prop, operator, value },
            ]);
        } else if (destination !== 'R') {
          newFrontier.set(destination, [
            ...prevConstraints,
            { prop, operator, value },
          ]);
        }
        if (isConstraintProp(prop) && isOperatorWithoutEqual(operator)) {
          prevConstraints.push({ prop, operator: neg[operator], value });
        }
      }
      if (elseDest === 'A') {
        acceptableConstraints.push(prevConstraints);
      } else if (elseDest !== 'R') {
        newFrontier.set(elseDest, prevConstraints);
      }
    }
    frontier = newFrontier;
  }

  return acceptableConstraints;
};

const getConstrainedRanges = (constraints: Constraint[]) => {
  const ranges: Ranges = { x: [1, MAX_VALUE], m: [1, MAX_VALUE], a: [1, MAX_VALUE], s: [1, MAX_VALUE] };
  for (const { prop, operator, value } of constraints) {
    const [start, end] = ranges[prop];
    if (operator === '<') ranges[prop] = [start, Math.min(end, value - 1)];
    else if (operator === '<=') ranges[prop] = [start, Math.min(end, value)];
    else if (operator === '>') ranges[prop] = [Math.max(start, value + 1), end];
    else if (operator === '>=') ranges[prop] = [Math.max(start, value), end];
  }
  return ranges;
};

const getRangesCombinations = (ranges: Ranges) =>
  Object.values(ranges)
    .map(([start, end]) => end + 1 - start)
    .reduce((product, value) => product * value);

const part1 = (rawInput: string) => {
  return parseParts(rawInput)
    .filter(isAcceptable(parseWorkflows(rawInput)))
    .reduce((sum, part) => sum + getPartValue(part), 0);
};

const part2 = (rawInput: string) => {
  return computePaths(parseWorkflows(rawInput))
  .map(getConstrainedRanges)
  .map(getRangesCombinations)
  .reduce((sum, value) => sum + value);
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
