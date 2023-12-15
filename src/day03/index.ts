import run from "aocrunner";

const numbers = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

const parseInputV1 = (rawInput: string) => {
  const input = rawInput.split("\n");
  const matrix = input.map((line) => line.split(""));

  const numbersInMatrix: { x: number, y: number[], values: '' }[] = [];
  const symbolsInMatrix: Record<number, number[]> = {};

  for (let i = 0; i < matrix.length; i++) {
    const line = matrix[i];
    let currentNumber: { x: number, y: number[], values: '' } | undefined = undefined;
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (numbers.has(char)) {
        currentNumber ??= { x: i, y: [], values: "" };
        currentNumber.y.push(j);
        currentNumber.values += char;
        continue;
      }
      if (currentNumber) {
        numbersInMatrix.push(currentNumber);
        currentNumber = undefined;
      }
      if (char !== ".") {
        symbolsInMatrix[i] ??= [];
        symbolsInMatrix[i].push(j);
      }
    }
    if (currentNumber) {
      numbersInMatrix.push(currentNumber);
    }
  }

  const numbersWithSymbolNeighbours: number[] = [];

  loop: for (const number of numbersInMatrix) {
    const { x, y: ys, values } = number;
    
    for (let i = x -1; i <= x + 1; i++) {
      for (const y of ys) {
        for (let j = y -1; j <= y + 1; j++) {
          if (symbolsInMatrix[i]?.includes(j)) {
            numbersWithSymbolNeighbours.push(+values);
            continue loop;
          }
        }
      }
    }
  }

  return numbersWithSymbolNeighbours;
};

const parseInputV2 = (rawInput: string) => {
  const input = rawInput.split("\n");
  const matrix = input.map((line) => line.split(""));

  const numbersInMatrix: { x: number, y: number[], values: '' }[] = [];
  const gearsInMatrix: Record<number, number[]> = {};

  for (let i = 0; i < matrix.length; i++) {
    const line = matrix[i];
    let currentNumber: { x: number, y: number[], values: '' } | undefined = undefined;
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (numbers.has(char)) {
        currentNumber ??= { x: i, y: [], values: "" };
        currentNumber.y.push(j);
        currentNumber.values += char;
        continue;
      }
      if (currentNumber) {
        numbersInMatrix.push(currentNumber);
        currentNumber = undefined;
      }
      if (char === "*") {
        gearsInMatrix[i] ??= [];
        gearsInMatrix[i].push(j);
      }
    }
    if (currentNumber) {
      numbersInMatrix.push(currentNumber);
    }
  }

  const numbersWithGears: Record<string, number[]> = {};

  loop: for (const number of numbersInMatrix) {
    const { x, y: ys, values } = number;
    
    for (let i = x -1; i <= x + 1; i++) {
      for (const y of ys) {
        for (let j = y -1; j <= y + 1; j++) {
          if (gearsInMatrix[i]?.includes(j)) {
            const key = `${i}-${j}`;
            numbersWithGears[key] ??= []
            numbersWithGears[key].push(+values);
            continue loop;
          }
        }
      }
    }
  }

  const res =  Object.values(numbersWithGears).map((values) => values.length < 2 ? 0 : values.reduce((acc, curr) => acc * curr, 1));

  console.log(res);

  return res;
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
