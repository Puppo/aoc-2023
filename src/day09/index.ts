import run from "aocrunner";

const parseInput = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => line.split(" ").map(Number));

const getNext = (sequence: number[]) => {
  const diffSeqs: number[][] = [];
  let currentSeq: number[] = sequence;
  while (currentSeq.some(Boolean)) {
    diffSeqs.push(currentSeq);
    currentSeq = Array.from(
      { length: currentSeq.length - 1 },
      (_, index) => currentSeq[index + 1] - currentSeq[index],
    );
  }

  return diffSeqs.reduceRight((sum, seq) => sum + seq[seq.length - 1], 0);
};

const part1 = (rawInput: string) => {
  const sequences = parseInput(rawInput);

  return sequences.map(getNext).reduce((sum, value) => sum + value);
};

const getPrevious = (sequence: number[]) => {
  const diffSeqs: number[][] = [];
  let currentSeq = sequence;
  while (currentSeq.some(Boolean)) {
    diffSeqs.push(currentSeq);
    currentSeq = Array.from(
      { length: currentSeq.length - 1 },
      (_, index) => currentSeq[index + 1] - currentSeq[index],
    );
  }
  return diffSeqs.reduceRight((sum, seq) => seq[0] - sum, 0);
};

const part2 = (rawInput: string) => {
  const sequences = parseInput(rawInput);

  return sequences.map(getPrevious).reduce((sum, value) => sum + value);
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
