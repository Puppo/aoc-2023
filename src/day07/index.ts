import run from "aocrunner";

type Hand = {
  hand: string;
  bid: number;
};

const parseInput = (rawInput: string) =>
  rawInput
    .trim()
    .split("\n")
    .map((line) => {
      const [hand, stringBid] = line.split(" ");
      return { hand, bid: Number(stringBid) };
    });

const cardOrder = "23456789TJQKA";
const typeChecks = [
  /(.)\1{4}/, // 5-of-a-kind,
  /(.)\1{3}/, // 4-of-a-kind,
  /^(.)\1{1,2}(.)\2{1,2}$/, // full house
  /(.)\1\1/, // 3-of-a-kind,
  /(.)\1.?(.)\2/, // two pair
  /(.)\1/, // one pair
  /(.)/, // high card
];

const getHandType = (hand: string) => {
  const sortedHand = hand.split("").sort().join("");
  return typeChecks.findIndex((check) => check.test(sortedHand));
};
const compareHands = (hand1: Hand, hand2: Hand) => {
  const typeDiff = getHandType(hand2.hand) - getHandType(hand1.hand);
  if (typeDiff) return typeDiff;
  for (let index = 0; index < hand1.hand.length; index++) {
    const card1 = hand1.hand[index];
    const card2 = hand2.hand[index];
    const cardDiff = cardOrder.indexOf(card1) - cardOrder.indexOf(card2);
    if (cardDiff) return cardDiff;
  }
  return 0;
};

const getTotalWinnings = (hands: Hand[]) =>
  hands.reduce((sum, hand, index) => sum + hand.bid * (index + 1), 0);

const part1 = (rawInput: string) => {
  const hands = parseInput(rawInput);

  const sortedHands = hands.slice().sort(compareHands);

  return getTotalWinnings(sortedHands);
};

const variantCardOrder = "J23456789TQKA";

const replaceJokers = (hand: string) => {
  if (hand === "JJJJJ") return "AAAAA";
  const nonJokerCards = hand
    .split("")
    .reduce<Record<string, number>>((map, card) => {
      if (card !== "J") {
        if (card in map) map[card]++;
        else map[card] = 1;
      }
      return map;
    }, {});
  const mostPresentCount = Math.max(...Object.values(nonJokerCards));
  const mostPresentCard = Object.keys(nonJokerCards).find(
    (card) => nonJokerCards[card] === mostPresentCount,
  )!;
  return hand.replaceAll("J", mostPresentCard);
};

const variantCompareHands = (hand1: Hand, hand2: Hand) => {
  const typeDiff =
    getHandType(replaceJokers(hand2.hand)) -
    getHandType(replaceJokers(hand1.hand));
  if (typeDiff) return typeDiff;
  for (let index = 0; index < hand1.hand.length; index++) {
    const card1 = hand1.hand[index];
    const card2 = hand2.hand[index];
    // ... and use the variant card order.
    const cardDiff =
      variantCardOrder.indexOf(card1) - variantCardOrder.indexOf(card2);
    if (cardDiff) return cardDiff;
  }
  return 0;
};

const part2 = (rawInput: string) => {
  const hands = parseInput(rawInput);

  const variantSortedHands = hands.slice().sort(variantCompareHands);

  return getTotalWinnings(variantSortedHands);
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
