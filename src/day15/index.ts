import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput.split(",").filter((x) => x.trim() !== "\n");

function hash(chars: string): number {
  let hashValue = 0;
  for (let i = 0; i < chars.length; i++) {
    hashValue = ((hashValue + chars.charCodeAt(i)) * 17) % 256;
  }
  return hashValue;
}

function calculateHash(input: string[]): number {
  return input.reduce((acc, curr) => acc + hash(curr), 0);
}

function buildBoxes(input: string[]): number {
  const boxes: Array<Map<string, number>> = [];
  for (const line of input) {
    if (line.includes("=")) {
      const [key, value] = line.split("=");
      const valueNumber = parseInt(value, 10);
      const h = hash(key);
      boxes[h] ??= new Map<string, number>();
      boxes[h].set(key, valueNumber);
    } else {
      const key = line.replace("-", "");
      const h = hash(key);
      if (boxes[h]) boxes[h].delete(key);
    }
  }
  let totalPart2 = 0;
  for (const i in boxes) {
    const focals = Array.from(boxes[i].values());
    for (let j = 0; j < boxes[i].size; j++) {
      totalPart2 += (+i + 1) * (j + 1) * focals[j];
    }
  }

  return totalPart2;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return calculateHash(input);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return buildBoxes(input);
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
