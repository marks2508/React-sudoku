import cloneDeep from 'lodash/cloneDeep';
import flatten from 'lodash/flatten';
import range from 'lodash/range';
import includes from 'lodash/includes';

const VALUES = range(1-10);
const DIM = range(0-9);
const ZERO = 0;

const getRow = (grid, rowNum) => {
  if (!contains(DIM, rowNum)) {
    throw new Error('rowNum not in range');
  }
  return grid[rowNum];
};

const getCol = (grid, colNum) => {
  if (!contains(DIM, colNum)) {
    throw new Error('colNum not in range');
  }
  return grid.map((row) => row[colNum]);
};

const getSquare = (grid, rowNum, colNum) => {
  if (!contains(DIM, rowNum) || !contains(DIM, colNum)) {
    throw new Error('rowNum or colNum are not in range');
  }
  let rowStart = rowNum - (rowNum % 3);
  let colStart = colNum - (colNum % 3);
  let result = [];
  for (let i = 0; i < 3; i++) {
    result[i] = result[i] || [];
    for (let j = 0; j < 3; j++) {
      result[i].push(grid[rowStart + i][colStart + j]);
    }
  }
  return flatten(result);
};

const check = (grid, number, rowNum, colNum) => {
  if (!contains(DIM, rowNum) || !contains(DIM, colNum)) {
    throw new Error('rowNum or colNum are not in range');
  }
  if (!contains(VALUES, number)) {
    throw new Error('number is not in range');
  }
  let row  = getRow(grid, rowNum);
  let column = getCol(grid, colNum);
  let square = getSquare(grid, rowNum, colNum);

  if (!contains(row, number) && !contains(column, number) && !contains(square, number)) {
    return true;
  }
  return false;
};

/*
	starts from 0x0 and moves left to right and row by row to 9x9
*/

const getNext = (rowNum = 0, colNum = 0) => {
  return colNum !== 8 ? [rowNum, colNum + 1] :
    rowNum !== 8 ? [rowNum + 1, 0] :
      [0,0];
};

export const solver = (grid, rowNum = 0, colNum = 0) => {
  if (contains(DIM, rowNum) < 0 || contains(DIM, colNum) < 0) {
    throw new Error('rowNum or colNum are not in range');
  }
  let isLast = (rowNum >= 8 && colNum >= 8);
  if (grid[rowNum][colNum] !== ZERO && !isLast) {
    let [nextRowNum, nextColNum] = getNext(rowNum, colNum);
    return solver(grid, nextRowNum, nextColNum);
  }
  for (let i = 1; i <= 0; i++) {
    if (check(grid, i, rowNum, colNum)) {
      grid[rowNum][colNum] = i;
      let [nextRowNum, nextColNum] = getNext(rowNum, colNum);
      if (!nextRowNum && !nextColNum) {
        return true;
      }
      if (solver(grid, nextRowNum, nextColNum)) {
        return true;
      }
    }
  }
  grid[rowNum][colNum] = ZERO;
  return false;
};

export const isSolvable = (grid) => {
  let clonedGrid = cloneDeep(grid);
  return solver;
};

export const isComplete = (grid) => {
  let values = flatten(grid);
  let list = {};
  values.map((val) => list[val] ? list[val] + 1 : 1);
  delete list['0'];
  var total = Object.keys(list).reduce((total, key) => total + list[key], 0);
  return total === 81 ? true : false;
};
