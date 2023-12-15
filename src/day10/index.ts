import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const lineWidth = rawInput.indexOf('\n') + 1

  const path = Array.from(getPath(rawInput.indexOf('S'), rawInput, lineWidth))

  const junctionMap = {
    '1,1': '-',
    [`${lineWidth},${lineWidth}`]: '|',
    [`${lineWidth},1`]: 'L',
    [`${lineWidth},-1`]: 'J',
    [`1,${lineWidth},1`]: 'F',
    [`-1,${lineWidth},-1`]: '7',
  };

  const startJunction = junctionMap[`${path[path.length -1] - path[0]},${path[path.length-2] - path[path.length-1]}`];

  const cleanField = Array.from(rawInput, (char, index) =>
    char === 'S'
      ? startJunction
      : char === '\n' || path.includes(index)
      ? char
      : '.'
  ).join('');

  return {
    lineWidth,
    path,
    cleanField,
  }
};

function getPosition(input: string, start: number, lineWidth: number) {
  return /[F|7]/.test(input.charAt(start - lineWidth))
    ? start - lineWidth
    : /[J\-7]/.test(input.charAt(start + 1))
      ? start + 1
      : /[J|L]/.test(input.charAt(start + lineWidth))
        ? start + lineWidth
        : /[L\-F]/.test(input.charAt(start - 1))
          ? start - 1
          : start;
}

function* getPath(start: number, input: string, lineWidth: number) {
  let position = getPosition(input, start, lineWidth);
  let previous = start;
  while (position !== start) {
    yield position;
    let oldPosition = position;
    if (input[position] === '|')
      position =
        position + lineWidth === previous
          ? position - lineWidth
          : position + lineWidth;
    else if (input[position] === '-')
      position = position + 1 === previous ? position - 1 : position + 1;
    else if (input[position] === '7')
      position =
        position + lineWidth === previous ? position - 1 : position + lineWidth;
    else if (input[position] === 'F')
      position =
        position + lineWidth === previous ? position + 1 : position + lineWidth;
    else if (input[position] === 'J')
      position =
        position - lineWidth === previous ? position - 1 : position - lineWidth;
    else
      position =
        position - lineWidth === previous ? position + 1 : position - lineWidth;
    previous = oldPosition;
  }
  yield start;
}

const part1 = (rawInput: string) => {
  const { path } = parseInput(rawInput);

  return path.length / 2
};


const reSplitter = /\||F-*J|L-*7/;
const isInside = (cleanField: string) => (index: number) => {
  if (cleanField[index] !== '.') return false;
  const subLine = cleanField.slice(index + 1, cleanField.indexOf('\n', index));
  return (subLine.split(reSplitter).length & 1) === 0;
};

const part2 = (rawInput: string) => {
  const { cleanField } = parseInput(rawInput);

  const isInsideFn = isInside(cleanField);

  const insideCells = Array.from(cleanField.matchAll(/\./g)).filter(({ index }) => isInsideFn(index));

  return insideCells.length
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

