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


// Convert a dictionary word into its corresponding digit string
function dictionaryWordToDigits(word) {
  const upperCaseWord = word.toUpperCase();
  let digits = "";
  for (let char of upperCaseWord) {
    for (let digit in digitToChars) {
      if (digitToChars[digit].includes(char)) {
        digits += digit;
        break;
      }
    }
  }
  return digits;
}

// Load dictionary from file, return the words list and min/max word lengths
function loadDictionary(file) {
  let minLen = Infinity;
  let maxLen = 0;
  const content = fs.readFileSync(file, "utf8");
  const contentArray = content
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  contentArray.forEach((word) => {
    minLen = Math.min(minLen, word.length);
    maxLen = Math.max(maxLen, word.length);
  });
  return { contentArray, minLen, maxLen };
}

// Build a map from digit strings to dictionary words
function getDictionaryMap(dictionaryWords) {
  const map = new Map();
  for (const word of dictionaryWords) {
    const digits = dictionaryWordToDigits(word);
    if (!map.has(digits)) {
      map.set(digits, []);
    }
    map.get(digits).push(word.toUpperCase());
  }
  return map;
}

function readPhoneNumbers(file, callback) {
  const rl = file
    ? readline.createInterface({
        input: fs.createReadStream(file),
      })
    : readline.createInterface({
        input: process.stdin,
      });

  rl.on("line", (line) => {
    console.log(line,':');
    const number = line.replace(/[^0-9]/g, "");
    if (number.length === 0) return;
    callback(number);
     console.log('');
  });
  rl.on("close", () => {});
}


function phonewordDP(number, dictionary, dictionaryMap) {
  const memo = new Map(); 

  // dp function returns all possible sequences from index
  //useNumber indicates whether a digit has already been left previously
  function dp(index, usedNumber) {
    const key = index + "_" + usedNumber;
    if (memo.has(key)) return memo.get(key);
    if (index === number.length) return [[]];// Reached end, return empty path

    const result = [];

    for (
      let end = index + dictionary.minLen;
      end <= Math.min(index + dictionary.maxLen, number.length);
      end++
    ) {
      const segment = number.slice(index, end);
      if (dictionaryMap.has(segment)) {
        for (const word of dictionaryMap.get(segment)) {
          const subResults = dp(end, false);
          for (const sub of subResults) {
            result.push([word, ...sub]);
          }
        }
      }
    }

    // use a digit as is if no digit used previously (avoid consecutive digits)
    if (!usedNumber) {
      const digit = number[index];
      const subResults = dp(index + 1, true);
      for (const sub of subResults) {
        result.push([digit, ...sub]);
      }
    }

    memo.set(key, result);
    return result;
  }

  return dp(0, false).map((parts) => parts.join("-"));
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


readPhoneNumbers(inputFile, (number) => {
  const results = phonewordDP(number, dictionary, dictionaryMap);
  for (const result of results) {
    console.log(result);
  }
});