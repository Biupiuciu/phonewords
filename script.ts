const fs = require("fs");
const readline = require("readline");

const digitToChars = {
  "2": "ABC",
  "3": "DEF",
  "4": "GHI",
  "5": "JKL",
  "6": "MNO",
  "7": "PQRS",
  "8": "TUV",
  "9": "WXYZ",
};

function dictionaryWordToDigits(word: string) {
  const upperCaseWord = word.toUpperCase();
  let digits = "";
  for (let char of upperCaseWord) {
    for (let digit in digitToChars) {
      if (digitToChars[digit as keyof typeof digitToChars].includes(char)) {
        digits = digits + digit;
        break;
      }
    }
  }
  return digits;
}

function loadDictionary(file: string) {
  let minLen = Infinity;
  let maxLen = 0;
  const content = fs.readFileSync(file, "utf8");
  const contentArray = content
    .split(/\r?\n/)
    .map((item: string) => item.trim())
    .filter((item: string) => item.length > 0);
  contentArray.forEach((content: string) => {
    if (content.length > maxLen) maxLen = content.length;

    if (content.length < minLen) minLen = content.length;
  });

  return { contentArray, minLen, maxLen };
}

function getDictionaryMap(dictionaryWords: string[]) {
  const map = new Map();
  dictionaryWords.forEach((word) => {
    const digits = dictionaryWordToDigits(word);
    if (!map.has(digits)) {
      map.set(digits, []);
    }
    map.get(digits).push(word.toUpperCase());
  });
  return map;
}

function readPhoneNumbers(
  file: string | undefined,
  callback: (number: string) => void
) {
  const rl = file
    ? readline.createInterface({
        input: fs.createReadStream(file),
      })
    : readline.createInterface({
        input: process.stdin,
      });

  rl.on("line", (line: string) => {
    const number = line.replace(/[^0-9]/g, "");
    if (number.length === 0) return;

    callback(number);
  });
  rl.on("close", () => {});
}

function search(
  number: string,
  index = 0,
  path: string[] = [],
  results: string[] = [],
  hasNumber: boolean
) {
  if (index >= number.length) {
    results.push(path.join("-"));
    return;
  }

  for (
    let end = index + dictionary.minLen;
    end <= Math.min(index + dictionary.maxLen, number.length);
    end++
  ) {
    const segment = number.slice(index, end);

    if (dictionaryMap.has(segment)) {
      for (let word of dictionaryMap.get(segment)) {
        search(number, end, [...path, word], results, hasNumber);
      }
    }
  }

  if (path.length === 0 || isNaN(Number(path[path.length - 1]))) {
    search(
      number,
      index + 1,
      [...path, number[index] as string],
      results,
      true
    );
  }
}

let dictionaryFile;
let inputFile;
const args = process.argv.slice(2);

for (let i = 0; i < args.length; i++) {
  if (args[i] === "-dictionary") {
    dictionaryFile = args[i + 1];
    i++;
  } else {
    inputFile = args[i];
  }
}

if (!dictionaryFile) {
  console.error("use -dictionary to specify the dictionary path.");
  process.exit(1);
}

const dictionary = loadDictionary(dictionaryFile);
const dictionaryMap = getDictionaryMap(dictionary.contentArray);

readPhoneNumbers(inputFile, (number: string) => {
  const results: string[] = [];

  search(number, 0, [], results, false);

  for (const result of results) {
    console.log(result);
  }
});
