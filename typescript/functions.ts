{
  /**
   * function
   */

  // we can use the function keyword
  function myFunc() {
    return true;
  }

  // or... we can use a fat arrow and assign
  // to a variable
  const anotherFunc = () => true;

  // or, we can use the function keyword and assign to a variable
  const yetAnotherFunc = function () {
    return true;
  };

  // regardless, we call them the same:

  console.log("function.definition", {
    f1: myFunc(),
    f2: anotherFunc(),
    f3: yetAnotherFunc(),
  });

  const myObject = {
    // you can use fat arrows or function keyword...
    doStuff: () => {
      return "done";
    },
    // or... you can drop the syntax even more
    doItCooler() {
      return "doner";
    },
  };

  console.log("function.in-object", myObject.doStuff(), myObject.doItCooler());

  // Make sure to unwrap optional functions
  const optionalFunc: undefined | (() => void) = undefined;
  console.log("function.optional-unwrap", optionalFunc?.());

  // IIFE - immediately invoked function expression
  const myValue = (() => {
    switch (true) {
      case 1 - 1 === 0:
        return "steve";
      default:
        return "joe";
    }
  })();

  console.log("function.iife", myValue);
}

{
  /**
   * async / await / Promises
   */

  // We can convert callbacks into Promises
  const wait = (ms: number) =>
    new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  console.log("async.promises", "hi ma! I guess I can wait!");
  await wait(1000)
    .then(() => console.log("async.promises", "I am done ma!"))
    .then(() => wait(1000))
    .then(() => console.log("async.promises", "seriously ma!"));
  // That looks a lot better than the alternative... shown below:
  /*
    setTimeout(() => {
      console.log("I am done ma!")
      setTimeout(() => {
        console.log("seriously ma!")
      }, 1000)
    }, 1000)
  */

  // But... we can do better!

  await wait(1000);
  console.log("async.await", "log 1");
  await wait(1000);
  console.log("async.await", "log 2");
}

{
  /**
   * Generators
   */

  function* myFirstIterator() {
    yield 0;
    yield 1;
    yield 1;
    yield 2;
    yield 3;
    yield 5;
  }

  const myFirstIter = myFirstIterator();
  // Let's see what happens next...
  console.log("generator.next", myFirstIter.next());
  console.log("generator.next", myFirstIter.next());
  console.log("generator.next", myFirstIter.next());
  console.log("generator.next", myFirstIter.next());
  console.log("generator.next", myFirstIter.next());
  console.log("generator.next", myFirstIter.next());
  console.log("generator.next", myFirstIter.next());

  // That was painful... forof to the rescue
  for (const value of myFirstIterator()) {
    console.log("generator.forof", value);
  }

  // And... did we mention spread?
  console.log("generator.spread", [...myFirstIterator()]);

  // and, we can create iterators from iterators...
  function* mySecondIterator() {
    for (const value of myFirstIterator()) {
      yield value * value - 1;
    }
  }

  console.log("generator.from-generator", [...mySecondIterator()]);
}

export {};
