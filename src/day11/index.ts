import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const lines = rawInput.trim().split('\n');

  const emptyColumns: number[] = [];
  for (let i = lines[0].length - 1; i >= 0; i--) {
    if (lines.every((line) => line[i] === '.')) {
      emptyColumns.push(i);
    }
  }

  const emptyRows: number[] = [];
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].split('').every((col) => col === '.')) {
      emptyRows.push(i);
    }
  }

  const galaxies: [number, number][] = [];
  for (let row = 0; row < lines.length; row++) {
    for (let column = 0; column < lines[row].length; column++) {
      if (lines[row][column] === '#') {
        galaxies.push([row, column]);
      }
    }
  }

  return { galaxies, emptyColumns, emptyRows };
};

const countElementLessThen = (array: number[], v: number) => {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] < v) {
      total++;
    }
  }
  return total;
}

const getGalaxiesDistance = (galaxyA: number[], galaxyB: number[], factor: number, emptyRows: number[], emptyCols: number[]) => {
  const rowEmptyCount = Math.abs(countElementLessThen(emptyRows, galaxyA[0]) - countElementLessThen(emptyRows, galaxyB[0]))
  const colEmptyCount = Math.abs(countElementLessThen(emptyCols, galaxyA[1]) - countElementLessThen(emptyCols, galaxyB[1]))
  const distanceFactor = (rowEmptyCount + colEmptyCount) * (factor - 1)
  const regularDistance = Math.abs(galaxyA[0] - galaxyB[0]) + Math.abs(galaxyA[1] - galaxyB[1])

  return distanceFactor + regularDistance;
}


const getTotalDistance = (galaxies: number[][], factor: number, emptyRows: number[], emptyCols: number[]) => {
  let totalDistance = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      totalDistance += getGalaxiesDistance(galaxies[i], galaxies[j], factor, emptyRows, emptyCols)
    }
  }
  return totalDistance;
}

const part1 = (rawInput: string) => {
  const {
    galaxies,
    emptyColumns,
    emptyRows,
  } = parseInput(rawInput);

  return getTotalDistance(galaxies,2,emptyRows,emptyColumns) 
};


const part2 = (rawInput: string) => {
  const {
    galaxies,
    emptyColumns,
    emptyRows,
  } = parseInput(rawInput);

  return getTotalDistance(galaxies,1000000,emptyRows,emptyColumns)
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
