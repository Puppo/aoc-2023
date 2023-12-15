import run from "aocrunner";

const numbers = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
const numbersWord = {
  "one": "1",
  "two": "2",
  "three": "3",
  "four": "4",
  "five": "5",
  "six": "6",
  "seven": "7",
  "eight": "8",
  "nine": "9"
};

const parseInputV1 = (rawInput: string) => {
  const rows = rawInput.split("\n");
  const resultRows:number[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let rowNumbers = '';
    for (let j = 0; j < row.length; j++) {
      const char = row[j];
      if (numbers.has(char)) {
        rowNumbers += char;
      }
    }
    resultRows[i] = parseInt(rowNumbers[0] + rowNumbers[rowNumbers.length - 1], 10);
  }
  
  return resultRows;
}


const parseInputV2 = (rawInput: string) => {
  const rows = rawInput.split("\n");
  const resultRows:number[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let rowNumbers = '';
    for (let j = 0; j < row.length; j++) {
      const char = row[j];
      if (numbers.has(char)) {
        rowNumbers += char;
      } else {
        for (const [key, value] of Object.entries(numbersWord)) {
          if (row.substring(j, j + key.length) === key) {
            rowNumbers += value;
            break;
          }
        }
      }
    }
    resultRows[i] = parseInt(rowNumbers[0] + rowNumbers[rowNumbers.length - 1], 10);
  }
  
  return resultRows;
}

function sum(array: number[]) {
  return array.reduce((acc, val) => val + acc, 0);
}

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
