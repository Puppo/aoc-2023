import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const seeds = rawInput.slice(7, rawInput.indexOf('\n\n')).split(' ').map(Number);
  const maps = rawInput.trim().slice(rawInput.indexOf('\n\n') + 2).split('\n\n').map(
    block => block.split('\n').slice(1).map(line => line.split(' ').map(Number))
  );

  return { seeds, maps };
};

const part1 = (rawInput: string) => {
  const { maps, seeds } = parseInput(rawInput);

  const mapValue = (value: number, map: number[][]) => {
    for (const [destination, source, length] of map)
      if (value >= source && value < source + length)
        return destination + value - source;
    return value;
  };
  
  const seedLocations = seeds.map(seed => maps.reduce(mapValue, seed));

  return Math.min(...seedLocations);
};

const splitRangesByMap = ([start, rangeLength]: number[], map: number[][]) => {
  const subRanges: [number, number][] = [];
  let index = start;
  const rangeEnd = start + rangeLength;
  while (index < rangeEnd) {
    let mapping = map.find(([, source, length]) => source <= index && source + length > index);
    let subRange: [number, number] | undefined;
    if (mapping) {
      const end = Math.min(rangeEnd, mapping[1] + mapping[2]);
      subRange = [mapping[0] + index - mapping[1], end - index];
      index = end;
    } else {
      const [, cEnd] = map.find(([, source]) => source > index && source < rangeEnd) ?? [0, rangeEnd];
      subRange = [index, cEnd - index];
      index = cEnd;
    }
    subRanges.push(subRange);
  }
  return subRanges;
}

const part2 = (rawInput: string) => {
  const { maps, seeds } = parseInput(rawInput);

  const seedRanges = Array.from(
    { length: seeds.length / 2 },
    (_, index) => seeds.slice(index * 2, index * 2 + 2)
  );

  const locationRanges = maps.reduce(
    (sourceRanges, map) => sourceRanges.flatMap(range => splitRangesByMap(range, map)),
    seedRanges
  );

  return Math.min(...locationRanges.map(([start]) => start));
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
