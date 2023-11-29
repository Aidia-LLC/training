declare const __brand: unique symbol;

{
  /**
   * Types
   */

  // Define variable type to disambiguate
  const stringArray: string[] = [];
  // Define custom types to make your code more readable
  type Point = { x: number; y: number };
  // You can define tuples
  type Line = [Point, Point];
  // Or just plain arrays of any length
  type Shape = Line[];
  // You can create new types from types by merging
  type ThreeDPoint = Point & { z: number };
  // Use unions to allow multiple types
  type Triangle = [Point, Point, Point];
  type Quadrilateral = [Point, Point, Point, Point];
  type SimpleShape = Triangle | Quadrilateral;
}

{
  /**
   * Type Helpers
   */
  type User = {
    id: number;
    fname: string;
    lname: string;
    email: string;
    friends?: {
      friendsSince: Date;
      friend: User;
    }[];
  };
  // Pick selects keys from a type
  type UserAuth = Pick<User, "id" | "email">;
  // Omit does the inverse - select keys which are not required
  type UserCreate = Omit<User, "id">;
  // NonNullable allows us to get types from nullable items
  type Friend = NonNullable<User["friends"]>[number];
  // ReturnType allows us to get the return type from a function
  const myFunc = (p: string, q: number, r: boolean) => 1;
  type MyFuncReturn = ReturnType<
    // note that I'm requesting the type of myFunc dynamically!
    typeof myFunc
  >;
  // while Parameters gets the types of the function as a tuple!
  type MyFuncParams = Parameters<typeof myFunc>;
  type MyThirdFuncParam = MyFuncParams[2];
  // Many other type helpers exist!
}

{
  /**
   * inferring types
   */

  // discriminated union
  type Client = { role: "user"; name: string };
  type Admin = { role: "admin"; privileges: any[] };
  type User = Client | Admin;
  // We can determine the data type based off of role
  const user = { role: "admin", privileges: [] } as User;
  switch (user.role) {
    case "admin":
      // user is an admin!
      break;
    case "user":
      // user is a user
      break;
    default: {
      // set a "never" data type to ensure you catch all discriminated union cases
      const t: never = user;
    }
  }

  // we can do this in if statements too!
  if (user.role === "admin") {
    // I'm an admin!
  }

  // types look at shape
  type Mammal = { animalName: string };
  type Animal = { animalName: string };
  const myAnimal: Animal = { animalName: "goldfish" };
  const sayHiMammal = (mammal: Mammal) => `say hi ${mammal.animalName}!`;
  sayHiMammal(myAnimal); // happy, because the shape matches

  // We can get stricter using branded types
  type PositiveNumber = number & {
    [__brand]: "PositiveNumber";
  };

  const sumPositiveNumbers = (a: PositiveNumber, b: PositiveNumber) =>
    (a + b) as PositiveNumber;

  // @ts-expect-error
  sumPositiveNumbers(-1, -1); // TS has an error now because we don't have a positive number
  sumPositiveNumbers(
    1 as PositiveNumber, // This seems sketch...
    1 as PositiveNumber
  );

  // We can attache the brand using special declaration functions
  const isPositiveNumber = (v: number): v is PositiveNumber => v > 0;
  const num1 = 1;
  const num2 = -1;
  if (isPositiveNumber(num1) && isPositiveNumber(num2)) {
    sumPositiveNumbers(num1, num2);
  }
}

{
  /**
   * as const and satisfies
   */

  // as allows us to cast types

  const myVariable = 1 as any; // myVariable is now any

  // as const allows us to create an object literal or a tuple
  // and... it will complain if we try to modify it later
  const myDataStructure = {
    hello: "bonjour",
  } as const;

  const myTuple = ["apples", "oranges", false] as const;

  type User = {
    name: string;
  };

  // we can run into situations where we want to make sure a particular type is returned without exposing the type
  const returnAUser = () =>
    ({
      name: "steve",
      email: "hi", // email is not defined on the User type but this is fine?!
    } as User); // and now the return type of the function is User!

  // but, we can get around that by using satisfies
  const returnASatisfiedUser = () =>
    ({
      name: "steve",
      // @ts-expect-error
      email: "hi", // we got an error
    } satisfies User); // and return type is *not* User!
}

{
  /**
   * Types are a language...
   */

  // Generics

  // We can create smart functions
  // so we don't need to manually disambiguate
  // everything...

  type PositiveNumber = number & {
    [__brand]: "PositiveNumber";
  };

  const addNumbers = <T extends number>(a: T, b: T) => (a + b) as T;
  const add1 = addNumbers<number>(1, 2); // type is number!
  const add2 = addNumbers<PositiveNumber>(
    1 as PositiveNumber,
    2 as PositiveNumber
  ); // type is PositiveNumber!
  const add3 = addNumbers(1, 2); // type is 1 | 2???
  const a = 1;
  const b = 2;
  const add4 = addNumbers(a, b); // type is still 1 | 2!
  // literals can mess generics up... be careful!

  type CrazyGeneric<T> = T extends string
    ? "string"
    : T extends number
    ? "number"
    : T extends boolean
    ? "boolean"
    : "unknown";

  const crazy1: CrazyGeneric<"hello"> = "string";
  const crazy2: CrazyGeneric<boolean> = "boolean";
  const crazy3: CrazyGeneric<typeof add2> = "number";
  const crazy4: CrazyGeneric<{ apple: true }> = "unknown";

  // Types are turing complete... people have literally built programs using just the types themselves
  // See ts-arithmetic for an example of this!
}
