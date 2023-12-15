import run from "aocrunner";

const parseInputV1 = (rawInput: string) => {
  const input = rawInput.split("\n");

  let winningCardsResults: number[] = [];

  for (const line of input) {
    const [, values] = line.split(":");
    const [winningString, cardString] = values.split("|");
    const winning = new Set(winningString.match(/\S+/g));
    const card = cardString.match(/\S+/g) as string[];
    const winningCards = card.filter((card) => winning.has(card));
    if (winningCards.length !== 0) {
      let res = 1;
      for (let i = 1; i < winningCards.length; i++) {
        res *= 2;
      }
      winningCardsResults.push(res);
    }
  }

  return winningCardsResults;
};

const parseInputV2 = (rawInput: string) => {
  const input = rawInput.split("\n");

  let cards: {
    winnings: Set<number>;
    numbers: number[];
    winningCount: number;
  }[] = [];

  for (const line of input) {
    const [, values] = line.split(":");
    const [winningString, cardString] = values.split("|");
    const winnings = new Set<number>(winningString.match(/\S+/g)?.map((card) => +card) ?? []);
    const card = cardString.match(/\S+/g) as string[];
    const numbers = card.map((card) => +card);
    const winningCount = numbers.filter((card) => winnings.has(card)).length;
    
    cards.push({
      winnings,
      numbers,
      winningCount
    });

  }

  return cards;
};

const sum = (arr: number[]) => arr.reduce((acc, curr) => acc + curr, 0);

const part1 = (rawInput: string) => {
  const input = parseInputV1(rawInput);

  return sum(input);
};

const part2 = (rawInput: string) => {
  const cards = parseInputV2(rawInput);

  const cardCounts = Array(cards.length).fill(1);
  cardCounts.forEach((count, index) => {
  for (let cardShift = 0; cardShift < cards[index].winningCount; cardShift++) {
    cardCounts[index + cardShift + 1] += count;
  }
});

  return sum(cardCounts);
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
