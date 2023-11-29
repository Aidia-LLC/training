/*
  Data Structure Review, special emphasis on array
*/

function compareArrays(arr1: any[], arr2: any[]) {
  if (arr1.length !== arr2.length) return false;
  // Note every below checks if every value in the array passes some condition.
  // some also exists - checks if any value passes some condition
  return arr1.every((a, i) => {
    const b = arr2[i];
    return a === b;
  });
}

function addOne(arr: number[]) {
  return arr;
}
console.assert(compareArrays(addOne([1, 2, 3]), [2, 3, 4]), "Add One");

function distinctValues(arr: number[]) {
  return arr;
}
console.assert(
  compareArrays(distinctValues([1, 1, 2, 1]), [1, 2]),
  "Distinct Values"
);

function distinctCounts(arr: number[]) {
  return arr;
}

console.assert(
  compareArrays(distinctCounts([1, 1, 2, 1, 3, 1, 3]), [4, 1, 2]),
  "Distinct Counts"
);

function product(arr: number[]) {
  return 0;
}

console.assert(product([1, 1, 2, 1, 3, 1, 3]) === 18, "Product");
