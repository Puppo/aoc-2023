import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split("\n\n").map((m) => m.split("\n"));

type CheckHorizontal = (pattern: string[], row: number) => boolean;

const checkHorizontal: CheckHorizontal = (pattern: string[], row: number): boolean  => {
  for (let i = row - 1, j = row; i >= 0 && j < pattern.length; i--, j++) {
    if (pattern[i] !== pattern[j]) return false;
  }
  return true;
}

const checkHorizontalWithSmudge: CheckHorizontal = (pattern: string[], row: number): boolean  => {
  let smudgeRow = -1
  for (let i = row - 1, j = row; i >= 0 && j < pattern.length; i--, j++) {
    // Rows
    const pi = pattern[i],
      pj = pattern[j];
    for (let k = 0; k < pi.length; k++) {
      // Columns
      if (pi[k] !== pj[k]) {
        if (smudgeRow > -1) return false;
        smudgeRow = i;
      }
    }
  }
  if (smudgeRow > -1) return true;
  return false;
}

function transpose(pattern: string[]): string[] {
  return pattern.reduce<string[]>((acc, row) => {
    return row.split('').reduce<string[]>((a, c, i) => {
      a[i] ??= "";
      a[i] += c;
      return a;
    }, acc);
  }, [])
}

function calculate(patterns: string[][], checkHorizontal: CheckHorizontal): number {
  let total = 0;
  p: for (const pattern of patterns) {
    // Horizontal
    for (let i = 1; i < pattern.length; i++) {
      if (checkHorizontal(pattern, i)) {
        total += 100 * i;
        continue p;
      }
    }

    // Vertical
    const transposed = transpose(pattern);
    for (let i = 1; i < transposed.length; i++) {
      if (checkHorizontal(transposed, i)) {
        total += i;
        continue p;
      }
    }
  }
  return total;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return calculate(input, checkHorizontal);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return calculate(input, checkHorizontalWithSmudge);
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
