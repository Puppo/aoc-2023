import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.trim().split("\n");

function explodeLine(line: string): string {
  let spl = line.split(" ");
  return (
    spl[0] + ("?" + spl[0]).repeat(4) + " " + spl[1] + ("," + spl[1]).repeat(4)
  );
}

function createTwoBranches(arr: [string, number][], char: string) {
  let clone: [string, number][] = [];

  //let's empty the array (evaluate all branches)
  while (arr.length > 0) {
    let x = arr.pop()!;

    //create 2 branches, one with a #, one with a . at the end of the current branch (partial string)
    if (char === "?") clone.push([x[0] + ".", x[1]], [x[0] + "#", x[1]]);
    //if not a ? just add the character
    else clone.push([x[0] + char, x[1]]);
  }
  return clone;
}

function calculate(inputs: string[]) {
  let answer = 0;
  for (let line of inputs) {
    let input = line.split(" ")[0];
    let grouping = line.split(" ")[1].split(",");

    //starting string, number of branches
    let arr: [string, number][] = [["", 1]];

    //for each character per input line
    for (const c of input) {
      let branches: [string, number][] = createTwoBranches(arr, c);

      //evaluate the branches
      for (let branch of branches) {
        let copy_elem = branch[0].split(".");

        //We're about to evaluate if groups of #'s sizes match the OG string grouping sizes.
        //Since the current grouping could be unfinished, we skip it unless we're done processing the string completely
        //But we'll ensure it's not too long
        let last_elem;
        if (branch[0].length != input.length) last_elem = copy_elem.pop();
        let temp_grouping = [];
        // we count the number of completed groupings for that branch
        for (let x of copy_elem) if (x.length > 0) temp_grouping.push(x.length);
        let keep = true;

        //we check that the popped elem isn't too long
        if (last_elem && last_elem.length > +grouping[temp_grouping.length])
          keep = false;

        for (let i = 0; i < temp_grouping.length; i++)
          // if the grouping is too short or long, discard the branch
          if (keep && temp_grouping[i] != +grouping[i]) keep = false;
          // if the string is complete, verify that we have the correct amount of groupings
          else if (
            keep &&
            branch[0].length == input.length &&
            temp_grouping.length != grouping.length
          )
            keep = false;
          //we evaluate that we have enough room to distribute the remaining #
          else if (
            keep &&
            grouping.reduce((a, b) => a + Number(b), 0) -
              (branch[0].match(/\#/g) || []).length >
              input.length - branch[0].length
          )
            keep = false;

        //if we passed all checks, we add the branch back to the array
        if (keep) arr.push(branch);
      }

      branches = [];
      let temp_obj: Record<string, [string, number]> = {};

      //for each potential branch
      for (let i = 0; i < arr.length; i++) {
        //we keep all branches that are in the middle of building a grouping
        if (arr[i][0].slice(-1) == "#") branches.push(arr[i]);
        //for all others
        else {
          //count their groupings to date
          let stri = arr[i][0];
          let spl = stri.split(".");
          let acc = arr[i][1];
          let groupsCount = 0;
          for (let x of spl) if (x.length > 0) groupsCount++;
          const groups = groupsCount.toString();

          //for a given amount of grouping, keep only one string
          if (!temp_obj[groups]) temp_obj[groups] = [stri, 0];

          //sum the number of branches of branches we're pruning + the one we're keeping
          //as we continue building the string, we keep pruning and summing the sum
          temp_obj[groups][1] += acc;
        }
      }

      //we add back those single strings per number of groupings to the array to evaluate
      for (let x of Object.keys(temp_obj)) branches.push(temp_obj[x]);
      arr = [...branches];
      // clone = undefined;
      // temp_obj = undefined;
    }

    //Arguably could've been done earlier
    //We were lazy throughout the proces and often skipped validation of a string ending with a #
    //Some invalid strings made it in extremis
    //Final validation to remove strings where we don't have the right amount of groupings
    for (let elem of arr) {
      let spl = elem[0].split(".");
      let i = 0;
      for (let part of spl) if (part.length > 0) i++;
      if (i == grouping.length) answer += elem[1];
    }
  }

  return answer;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return calculate(input);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return calculate(input.map(explodeLine));
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
