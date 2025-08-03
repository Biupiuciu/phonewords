# Phonewords

Convert phone numbers into possible "Phoneword" combinations using a dictionary of words.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Biupiuciu/phonewords.git
cd phonewords
```

### 2.Make sure Node.js is installed

```bash
node -v
```

Download it from https://nodejs.org if not already installed.

### 3. Prepare your dictionary

Inside the cloned folder, there is a default dictionary.txt file. You can modify this file to include your own words (one word per line).

### 4. Run the program

You can run the script using one of the following methods:

#### Option 1: Read from input file

```bash
node script.js -dictionary dictionary.txt input.txt
```

#### Option 2: Read from standard input (stdin)

```bash
node script.js -dictionary dictionary.txt
```

Then type phone numbers directly (one per line).

## Input Format

- One phone number per line
- Punctuation or whitespace will be ignored automatically
