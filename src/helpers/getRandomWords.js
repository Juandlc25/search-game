import { completeList } from "../constants/completeList";

export const getRandomWords = () => {
  let lst = [];
  for (var i = 0; i < 5; i++) {
    let currItem =
      completeList[Math.floor(Math.random() * completeList.length)];
    if (lst.indexOf(currItem) === -1) {
      lst.push(currItem);
    } else {
      i--;
    }
  }
  return lst.sort((a, b) => {
    return b.length - a.length;
  });
};
