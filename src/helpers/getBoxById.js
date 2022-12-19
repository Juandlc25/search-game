import { WordSearchGenerator } from "./WordSearchGenerator";

WordSearchGenerator.prototype.getBoxById = function (id) {
  let [row, col] = id.split("-cell-");
  row -= 1; // subtract for 0 based index
  col -= 1; // subtract for 0 based index
  return Object.assign({}, this.gridArr[row][col], { row: row, col: col });
};
