import { alphabets } from "../constants/alphabets";
import { getRandomWords } from "./getRandomWords";

export function WordSearchGenerator(wordList, directions) {
  this.gridSize = 0;
  this.gridArr = [];
  this.directions =
    directions && directions.length ? directions : [-4, -3, -2, -1, 1, 2, 3, 4];
  this.wordList = wordList && wordList.length ? wordList : getRandomWords();
  this.wordList = this.wordList.map((item, i) => {
    return { text: item, index: i, found: false };
  });
  this.alreadyFound = [];
  this.startBox = null;
  this.endBox = null;
}

WordSearchGenerator.prototype.getRandomRow = function () {
  return Math.floor(Math.random() * this.gridSize);
};

WordSearchGenerator.prototype.getRandomColumn = function () {
  return Math.floor(Math.random() * this.gridSize);
};

WordSearchGenerator.prototype.getRandomDirection = function () {
  return this.directions[Math.floor(Math.random() * this.directions.length)];
};

WordSearchGenerator.prototype.setGridSize = function () {
  let len = this.wordList.length;
  let list = this.wordList.slice();
  let currLen = len;
  for (let i = 0; i < len; i++) {
    if (list[i].text.length > currLen) {
      currLen = list[i].text.length;
    }
  }
  this.gridSize = currLen + 3;
};

WordSearchGenerator.prototype.initGrid = function () {
  let grid = [];
  for (let i = 0; i < this.gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < this.gridSize; j++) {
      grid[i][j] = "$$";
    }
  }
  this.gridArr = grid.slice();
  for (var i = 0; i < this.wordList.length; i++) {
    this.populateWord(this.wordList[i].text);
  }
  this.populateUnusedBoxes();
};

WordSearchGenerator.prototype.isPlacable = function (word, start, direction) {
  let i = 0,
    wordLength = word.length;
  let currI = start.x,
    currJ = start.y;
  while (
    currI >= 0 &&
    currI < this.gridSize &&
    currJ >= 0 &&
    currJ < this.gridSize &&
    i < wordLength &&
    (this.gridArr[currI][currJ] === word[i] ||
      this.gridArr[currI][currJ] === "$$")
  ) {
    i++;
    switch (direction) {
      case -1: {
        currJ = currJ - 1;
        break;
      }
      case 1: {
        currJ++;
        break;
      }
      case -2: {
        currI--;
        break;
      }
      case 2: {
        currI++;
        break;
      }
      case 3: {
        currI++;
        currJ++;
        break;
      }
      case -3: {
        currI--;
        currJ--;
        break;
      }
      case 4: {
        currI++;
        currJ--;
        break;
      }
      case -4: {
        currI--;
        currJ++;
        break;
      }
      default: {
      }
    }
  }
  return i === wordLength;
};

WordSearchGenerator.prototype.placeWord = function (word, start, direction) {
  let i = 0,
    wordLength = word.length;
  let currI = start.x,
    currJ = start.y;
  while (i < wordLength) {
    this.gridArr[currI][currJ] = {
      letter: word[i],
      id: currI + 1 + "-cell-" + (currJ + 1),
      used: false,
      hilighted: false,
    };
    i++;
    switch (direction) {
      case -1: {
        currJ = currJ - 1;
        break;
      }
      case 1: {
        currJ++;
        break;
      }
      case -2: {
        currI--;
        break;
      }
      case 2: {
        currI++;
        break;
      }
      case 3: {
        currI++;
        currJ++;
        break;
      }
      case -3: {
        currI--;
        currJ--;
        break;
      }
      case 4: {
        currI++;
        currJ--;
        break;
      }
      case -4: {
        currI--;
        currJ++;
        break;
      }
      default: {
      }
    }
  }
};

WordSearchGenerator.prototype.populateWord = function (word) {
  let start = { x: this.getRandomRow(), y: this.getRandomColumn() };
  let dir = this.getRandomDirection();
  if (this.isPlacable(word, start, dir)) {
    this.placeWord(word.toUpperCase(), start, dir);
  } else {
    this.populateWord(word);
  }
};

WordSearchGenerator.prototype.populateUnusedBoxes = function () {
  let indexi;
  let indexj;
  for (indexi = 0; indexi < this.gridSize; indexi++) {
    for (indexj = 0; indexj < this.gridSize; indexj++) {
      if (this.gridArr[indexi][indexj] === "$$") {
        this.gridArr[indexi][indexj] = {
          letter: alphabets[Math.floor(Math.random() * 25)],
          id: indexi + 1 + "-cell-" + (indexj + 1),
          used: false,
          hilighted: false,
        };
      }
    }
  }
};

WordSearchGenerator.prototype.getDirection = function (startObj, endObj) {
  var dir;
  let stRow = startObj.row,
    stCol = startObj.col,
    curRow = endObj.row,
    curCol = endObj.col;

  if (curRow === stRow && curCol !== stCol) {
    if (stCol < curCol) {
      dir = 1;
    } else {
      dir = -1;
    }
  } else if (curCol === stCol && curRow !== stRow) {
    if (stRow < curRow) {
      dir = 2;
    } else {
      dir = -2;
    }
  } else if (
    curCol - stCol === curRow - stRow ||
    stCol - curCol === stRow - curRow
  ) {
    if (stRow < curRow && stCol < curCol) {
      dir = 3;
    } else if (stRow > curRow && stCol > curCol) {
      dir = -3;
    }
  } else if (
    stRow - curRow === curCol - stCol ||
    curCol - stCol === curRow - curRow
  ) {
    if (stRow < curRow && stCol > curCol) {
      dir = 4;
    } else if (stRow > curRow && stCol < curCol) {
      dir = -4;
    }
  }
  return dir ? dir : 0;
};

WordSearchGenerator.prototype.getStringBetweenPoints = function (
  startBox,
  endBox
) {
  var dir;
  dir = this.getDirection(startBox, endBox);
  return this.getStringByRowCol(startBox, endBox, dir);
};

WordSearchGenerator.prototype.getStringByRowCol = function (
  startBox,
  endBox,
  dir
) {
  var returnedString = "";
  var cellIds = [];
  let str = startBox.row,
    stc = startBox.col,
    enr = endBox.row,
    enc = endBox.col;

  switch (dir) {
    case -1: {
      for (let k = stc; k >= enc; k -= 1) {
        returnedString = returnedString + this.gridArr[str][k].letter;
        cellIds.push([str, k]);
      }
      break;
    }
    case 1: {
      for (let k = stc; k <= enc; k += 1) {
        returnedString = returnedString + this.gridArr[str][k].letter;
        cellIds.push([str, k]);
      }
      break;
    }
    case -2: {
      for (let k = str; k >= enr; k -= 1) {
        returnedString = returnedString + this.gridArr[k][stc].letter;
        cellIds.push([k, stc]);
      }
      break;
    }
    case 2: {
      for (let k = str; k <= enr; k += 1) {
        returnedString = returnedString + this.gridArr[k][stc].letter;
        cellIds.push([k, stc]);
      }
      break;
    }
    case -3: {
      for (let k = str, j = stc; k >= enr, j >= enc; k -= 1, j -= 1) {
        returnedString = returnedString + this.gridArr[k][j].letter;
        cellIds.push([k, j]);
      }
      break;
    }
    case 3: {
      for (let k = str, j = stc; k <= enr, j <= enc; k += 1, j += 1) {
        returnedString = returnedString + this.gridArr[k][j].letter;
        cellIds.push([k, j]);
      }
      break;
    }
    case -4: {
      for (let k = str, j = stc; k >= enr, j <= enc; k -= 1, j += 1) {
        returnedString = returnedString + this.gridArr[k][j].letter;
        cellIds.push([k, j]);
      }
      break;
    }
    case 4: {
      for (let k = str, j = stc; k <= enr, j >= enc; k += 1, j -= 1) {
        returnedString = returnedString + this.gridArr[k][j].letter;
        cellIds.push([k, j]);
      }
      break;
    }
    default: {
    }
  }
  return { str: returnedString, ids: cellIds };
};

WordSearchGenerator.prototype.TestString = function (testStr) {
  var str = testStr,
    reverseStr = "",
    matched = false,
    reverseMatched = false,
    matchFound = false,
    reverseMatchFound = false;

  for (let i = 0; i <= str.length; i += 1) {
    reverseStr = str.substring(i, i + 1) + reverseStr;
  }
  matched = this.matchString(str);
  reverseMatched = this.matchString(reverseStr);

  if (matched) {
    matchFound = this.isAlreadyFound(testStr);
  }
  if (reverseMatched) {
    reverseMatchFound = this.isAlreadyFound(reverseStr);
  }
  if (matched && !matchFound) {
    return { found: false, str: testStr, match: true };
  } else if (reverseMatched && !reverseMatchFound) {
    return { found: false, str: reverseStr, match: true };
  } else if (matchFound && reverseMatchFound) {
    return { found: true, match: false };
  } else {
    return { found: false, match: false };
  }
};

WordSearchGenerator.prototype.isAlreadyFound = function (str) {
  var count,
    found = false;
  for (count = 0; count < this.alreadyFound.length; count++) {
    if (str === this.alreadyFound[count]) {
      found = true;
      break;
    }
  }
  return found;
};

WordSearchGenerator.prototype.matchString = function (str) {
  var matched = false;
  for (let count = 0; count < this.wordList.length; count++) {
    if (str.toUpperCase() === this.wordList[count].text.toUpperCase()) {
      matched = true;
      break;
    }
  }
  return matched;
};

WordSearchGenerator.prototype.getBoxById = function (id) {
  let [row, col] = id.split("-cell-");
  row -= 1;
  col -= 1;
  return Object.assign({}, this.gridArr[row][col], { row: row, col: col });
};
