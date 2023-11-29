{
  /**
   * object
   */

  const symbol1 = Symbol("orange");
  const symbol2 = Symbol("orange");
  const symbol3 = Symbol("orange");

  const obj = {
    // keys can be set directly
    apple: "apple",
    // Or can be injected via brackets
    [symbol1]: 1,
    [symbol2]: 2,
    [symbol3]: 3,
  };

  // Keys can be strings or symbols
  // other types will be coerced into strings

  console.log(
    "object.access",
    // Access via "dot" notation
    obj.apple,
    // Or... access via "bracket" notation
    // especially if you need it to be a dynamic access
    obj[symbol1],
    obj
  );

  // Note that now I can only access the symbol key
  // if I have access to the symbol variable...
  // which creates essentially private and guaranteed unique fields

  type User = {
    fname: string;
    lname?: string | null | undefined;
  };

  const steve: User = {
    fname: "Steve",
  };

  const joe: User = {
    fname: "Joe",
    lname: "Gunsay",
  };

  console.log(
    "object.conditional-access",
    // For conditional access, make sure to unwrap
    steve.lname?.slice(3),
    // Force unwrap at your own risk...
    joe.lname!.slice(3)
  );

  // We can spread an object into a new object
  const newJoe = {
    ...joe,
    email: "joe@theaidia.com",
    // the last definition wins
    lname: "Mo",
  };

  console.log("object.spread", newJoe);

  // We can destructure elements and optionally rename them
  const { fname, lname: joeFname, ...ignoredJoe } = newJoe;
  console.log("object.destructuring", fname, joeFname, ignoredJoe);
}

{
  /**
   * array
   */

  // Arrays can contain any object
  const arr = [1, { hi: "yo" }, false];

  console.log(
    "Array.access",
    // Use bracket notation at your own risk...
    arr[0],
    // 'at' allows negative indexing and will remind you to unwrap
    arr.at(-1)
  );

  // Map creates a new list by operating on the values from the original list
  console.log(
    "Array.map",
    [1, 2, 3].map((value) => value * value)
  );
  // Filter creates a new list by filtering the values we want to keep
  console.log(
    "Array.filter",
    [1, 2, 3].filter((value) => value < 3)
  );
  // Reduce folds the list on itself to create something new
  console.log(
    "Array.reduce",
    [1, 2, 3].reduce((currentSum, nextValue) => currentSum + nextValue, 0)
  );
  // Sort sorts the original list
  console.log(
    "Array.sort",
    [1, 2, 3].sort((a, b) => b - a)
  );
  // Join transforms it into a single string with a custom delimiter
  console.log("Array.join", [1, 2, 3].join("; "));
  // Push, pop add and remove from the end of the array
  // Shift, unshift likewise add and remove from the beginning of the array
  const popper = [];
  popper.push(1);
  popper.unshift(3);
  console.log("Array.popper", popper.shift(), popper.pop(), popper);

  // We can destructure
  const [head, ...tail] = [1, 2, 3];
  console.log("Array.destructure", { head, tail });

  // And... we can spread
  const newArray = [...tail, 5, ...tail];
  console.log("Array.spread", newArray);

  // Finally, we can use for of to iterate through it
  for (const value of newArray) {
    console.log("Array.for-of", value);
  }
}

{
  /**
   * Set
   */

  const set = new Set([1, 2, 2, 3, 5]);

  console.log("set.creation", set, set.size);

  // we can add and remove elements

  set.add(10);
  set.add(10);
  set.add(10);
  set.add(10);
  set.delete(1);
  console.log(set);

  // we can iterate through the elements
  // with for of
  for (const value of set) {
    console.log("set.for-of", value);
  }

  // and, we can spread sets into arrays
  console.log("set.spread", [...set]);
}

{
  /**
   * map
   */

  const map = new Map([[1, 17]]);
  console.log(
    "map.basics",
    map,
    // map.get retrieves values
    map.get(1),
    // map.get uses strict equality...
    map.get("1" as any)
  );

  // map.set sets a value
  map.set(14, 60);
  console.log("map.set", map, map.size);
  // delete removes a value
  map.delete(1);
  console.log("map.delete", map, map.size);
  // for of to iterate through keys and values
  // note we are destructuring the returned array!
  for (const [key, value] of map) {
    console.log("map.for-of", { key, value });
  }
  // and... we can spread into an array!
  console.log("map.spread", [...map]);
}

{
  /**
   * object equality
   */

  const obj1 = {
    a: "a",
    b: "b",
    c: {
      d: "d",
    },
  };

  const obj2 = {
    ...obj1,
  };

  const obj3 = obj1;

  console.log("equality.check1", obj1 === obj2);
  console.log("equality.check2", obj1 === obj3);
  console.log("equality.check3", obj1.c === obj2.c);

  // spreading is a shallow copy
  obj1.a = "z";
  obj1.c.d = "y";

  console.log("equality.shallow", obj1, obj2, obj3);

  // Note that we can reassign attributes in the object
  // even though the objects are defined as "const"
}
