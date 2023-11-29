{
  /**
   * Scope and Variable Definitions
   *
   */
  const a = 1;
  let b = 2;

  b = 3; // let allows reassigning

  var c = 4; // don't use var... ever
  console.log("Scope.1", { a, b, c });

  {
    // Let and const have block scope
    // So... they only exist inside the brackets
    let a = 2;
    const b = 3;
    // var has function scope... and if no function, operates on "globalThis"
    var c = 5;
    console.log("Scope.2", { a, b, c });
  }

  console.log("Scope.3", { a, b, c });

  // line 18 overrided line 10... bad...
  // var creates indeterminate behavior. So don't use it.
}

{
  /**
   * Primitives
   */
  let a: undefined = undefined;
  let b: null = null;
  let c: boolean = true;
  c = false;
  let d: number = 0;
  let e: BigInt = 0n;
  let f: string = "whoohoo";
  let g: symbol = Symbol("wat");

  // Double Equality does loose checks

  console.log("Primitives.1", {
    ab: a == b,
    one: 1 == ("1" as any),
    de: d == (e as any),
  });

  // Triple Equality does strict checks
  console.log("Primitives.2", {
    ab: a === b,
    one: 1 === ("1" as any),
    // @ts-expect-error
    de: d === e,
  });

  // Don't be loose... be strict

  // Some values are "falsy"
  if (undefined || 0 || null || false || "") {
    console.log("Truthy");
  } else {
    console.log("Falsy");
  }

  // Rest are "truthy"
  if (1 && "hi" && true && Symbol("Cool")) {
    console.log("Truthy");
  } else {
    console.log("Falsy");
  }
}

{
  /**
   * Control
   */

  for (let i = 0; i < 100; i++) {
    if (i === 0) {
      console.log(i, "is nothing.");
      continue;
    } else if (i === 3) {
      console.log(i, "Sucka");
      break;
    } else {
      switch (true) {
        case i < 2:
          console.log(i, "Less than 2");
          break;
        default:
          console.log(i, "Not Less than 2");
          break;
      }
    }
  }
  // If your code looks like the above, your future self will
  // travel back in time to curse you for the rest of time...

  while (1 === (2 as any)) {
    // only do if true once
    console.log("while");
  }
  do {
    console.log("do while");
  } while (1 === (2 as any));
}
