# TypeScript Basics

Learn the fundamental types and concepts in TypeScript.

## Primitive Types

### String

```typescript
let name: string = "John"
let message: string = 'Hello'
let template: string = `Hello, ${name}!`
```

### Number

```typescript
let age: number = 25
let price: number = 99.99
let hex: number = 0xf00d
let binary: number = 0b1010
let octal: number = 0o744
```

### Boolean

```typescript
let isActive: boolean = true
let isComplete: boolean = false
```

### Null and Undefined

```typescript
let nothing: null = null
let notDefined: undefined = undefined

// With strictNullChecks: false
let value: string = null  // OK
let value2: string = undefined  // OK

// With strictNullChecks: true
let value3: string | null = null  // Must use union type
```

### Symbol

```typescript
let sym1: symbol = Symbol("key")
let sym2: symbol = Symbol("key")

console.log(sym1 === sym2)  // false
```

### BigInt

```typescript
let big: bigint = 100n
let big2: bigint = BigInt(100)
```

## Arrays

### Array Type

```typescript
let numbers: number[] = [1, 2, 3, 4, 5]
let names: string[] = ["Alice", "Bob", "Charlie"]

// Generic array type
let values: Array<number> = [1, 2, 3]
```

### Mixed Arrays

```typescript
let mixed: (string | number)[] = [1, "two", 3, "four"]
```

### Readonly Arrays

```typescript
let readonlyArray: readonly number[] = [1, 2, 3]
// readonlyArray.push(4)  // Error: Property 'push' does not exist

// Or use ReadonlyArray
let readonlyArray2: ReadonlyArray<number> = [1, 2, 3]
```

## Tuples

Fixed-length arrays with specific types:

```typescript
// Basic tuple
let person: [string, number] = ["Alice", 25]

// Accessing elements
let name = person[0]  // string
let age = person[1]   // number

// Destructuring
let [personName, personAge] = person
```

### Optional Tuple Elements

```typescript
let point: [number, number, number?] = [10, 20]
// or
let point2: [number, number, number?] = [10, 20, 30]
```

### Rest Elements in Tuples

```typescript
let tuple: [string, ...number[]] = ["hello", 1, 2, 3, 4]
```

### Readonly Tuples

```typescript
let readonlyTuple: readonly [string, number] = ["Alice", 25]
// readonlyTuple[0] = "Bob"  // Error: Cannot assign to '0'
```

## Objects

### Object Type

```typescript
let person: { name: string; age: number } = {
  name: "Alice",
  age: 25
}
```

### Optional Properties

```typescript
let user: { name: string; age?: number } = {
  name: "Bob"
}

user.age = 30  // OK
```

### Readonly Properties

```typescript
let config: { readonly apiUrl: string } = {
  apiUrl: "https://api.example.com"
}

// config.apiUrl = "new url"  // Error: Cannot assign to 'apiUrl'
```

### Index Signatures

```typescript
interface StringMap {
  [key: string]: string
}

let colors: StringMap = {
  red: "#ff0000",
  blue: "#0000ff"
}
```

## Enums

### Numeric Enums

```typescript
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right    // 3
}

let dir: Direction = Direction.Up
console.log(dir)  // 0
```

### String Enums

```typescript
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Pending = "PENDING"
}

let status: Status = Status.Active
console.log(status)  // "ACTIVE"
```

### Heterogeneous Enums

```typescript
enum Mixed {
  No = 0,
  Yes = "YES"
}
```

### Const Enums

```typescript
const enum Colors {
  Red,
  Green,
  Blue
}

let color = Colors.Red  // Inlined at compile time
```

## Any

Opt-out of type checking:

```typescript
let value: any = 42
value = "string"  // OK
value = true      // OK
value.foo()       // OK (no type checking)
```

⚠️ **Avoid using `any` when possible!**

## Unknown

Type-safe alternative to `any`:

```typescript
let value: unknown = 42

// Must check type before using
if (typeof value === "string") {
  console.log(value.toUpperCase())  // OK
}

// value.toUpperCase()  // Error: Object is of type 'unknown'
```

## Void

Function returns nothing:

```typescript
function log(message: string): void {
  console.log(message)
}

function doNothing(): void {
  return  // OK
  // return undefined  // OK
  // return null  // Error (with strictNullChecks)
}
```

## Never

Function never returns:

```typescript
function throwError(message: string): never {
  throw new Error(message)
}

function infiniteLoop(): never {
  while (true) {
    // ...
  }
}
```

## Type Assertions

Tell TypeScript the type of a value:

```typescript
// Angle-bracket syntax
let value: any = "hello"
let length: number = (<string>value).length

// As syntax (preferred in JSX)
let length2: number = (value as string).length
```

### Non-null Assertion

```typescript
function getValue(): string | null {
  return "value"
}

let value = getValue()!  // Assert non-null
console.log(value.length)  // OK
```

## Type Inference

TypeScript infers types automatically:

```typescript
let name = "Alice"  // Inferred as string
let age = 25        // Inferred as number
let isActive = true // Inferred as boolean

// Function return type inference
function add(a: number, b: number) {
  return a + b  // Inferred as number
}
```

## Union Types

Value can be one of several types:

```typescript
let id: string | number
id = "abc123"  // OK
id = 123       // OK
// id = true   // Error

function printId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase())
  } else {
    console.log(id.toFixed(2))
  }
}
```

## Intersection Types

Combine multiple types:

```typescript
interface Person {
  name: string
}

interface Employee {
  employeeId: number
}

type Staff = Person & Employee

let staff: Staff = {
  name: "Alice",
  employeeId: 123
}
```

## Literal Types

Exact values as types:

```typescript
let direction: "left" | "right" | "up" | "down"
direction = "left"  // OK
// direction = "forward"  // Error

type Status = "success" | "error" | "pending"
let status: Status = "success"

// Numeric literals
let dice: 1 | 2 | 3 | 4 | 5 | 6
dice = 3  // OK
// dice = 7  // Error
```

## Type Aliases

Create custom type names:

```typescript
type ID = string | number
type Point = { x: number; y: number }
type Callback = (data: string) => void

let userId: ID = "abc123"
let point: Point = { x: 10, y: 20 }
let callback: Callback = (data) => console.log(data)
```

## Interfaces

Define object shapes:

```typescript
interface User {
  id: number
  name: string
  email: string
  age?: number  // Optional
  readonly createdAt: Date  // Readonly
}

let user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  createdAt: new Date()
}
```

### Extending Interfaces

```typescript
interface Person {
  name: string
  age: number
}

interface Employee extends Person {
  employeeId: number
  department: string
}

let employee: Employee = {
  name: "Bob",
  age: 30,
  employeeId: 123,
  department: "Engineering"
}
```

### Interface vs Type Alias

```typescript
// Interface
interface Point {
  x: number
  y: number
}

// Type alias
type Point2 = {
  x: number
  y: number
}

// Interfaces can be extended
interface Point3D extends Point {
  z: number
}

// Type aliases use intersection
type Point3D2 = Point2 & { z: number }
```

## Functions

### Function Types

```typescript
// Named function
function add(a: number, b: number): number {
  return a + b
}

// Arrow function
const multiply = (a: number, b: number): number => {
  return a * b
}

// Function type
let divide: (a: number, b: number) => number
divide = (a, b) => a / b
```

### Optional Parameters

```typescript
function greet(name: string, greeting?: string): string {
  return `${greeting || "Hello"}, ${name}!`
}

greet("Alice")           // "Hello, Alice!"
greet("Bob", "Hi")       // "Hi, Bob!"
```

### Default Parameters

```typescript
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`
}

greet("Alice")     // "Hello, Alice!"
greet("Bob", "Hi") // "Hi, Bob!"
```

### Rest Parameters

```typescript
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0)
}

sum(1, 2, 3, 4, 5)  // 15
```

### Function Overloads

```typescript
function getValue(id: number): string
function getValue(name: string): number
function getValue(value: number | string): string | number {
  if (typeof value === "number") {
    return "ID: " + value
  } else {
    return value.length
  }
}

let result1 = getValue(123)      // string
let result2 = getValue("Alice")  // number
```

## Classes

### Basic Class

```typescript
class Person {
  name: string
  age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }

  greet(): string {
    return `Hello, I'm ${this.name}`
  }
}

let person = new Person("Alice", 25)
console.log(person.greet())
```

### Access Modifiers

```typescript
class BankAccount {
  public accountNumber: string
  private balance: number
  protected owner: string

  constructor(accountNumber: string, balance: number, owner: string) {
    this.accountNumber = accountNumber
    this.balance = balance
    this.owner = owner
  }

  public deposit(amount: number): void {
    this.balance += amount
  }

  public getBalance(): number {
    return this.balance
  }
}
```

### Readonly Properties

```typescript
class Person {
  readonly id: number
  name: string

  constructor(id: number, name: string) {
    this.id = id
    this.name = name
  }
}

let person = new Person(1, "Alice")
// person.id = 2  // Error: Cannot assign to 'id'
```

### Parameter Properties

```typescript
class Person {
  constructor(
    public name: string,
    private age: number,
    readonly id: number
  ) {}
}

// Equivalent to:
class Person2 {
  public name: string
  private age: number
  readonly id: number

  constructor(name: string, age: number, id: number) {
    this.name = name
    this.age = age
    this.id = id
  }
}
```

### Inheritance

```typescript
class Animal {
  constructor(public name: string) {}

  move(distance: number): void {
    console.log(`${this.name} moved ${distance}m`)
  }
}

class Dog extends Animal {
  bark(): void {
    console.log("Woof! Woof!")
  }
}

let dog = new Dog("Buddy")
dog.bark()
dog.move(10)
```

### Abstract Classes

```typescript
abstract class Shape {
  abstract getArea(): number

  describe(): string {
    return `Area: ${this.getArea()}`
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super()
  }

  getArea(): number {
    return Math.PI * this.radius ** 2
  }
}

let circle = new Circle(5)
console.log(circle.describe())
```

## Best Practices

- ✅ Use `const` and `let` instead of `var`
- ✅ Enable strict mode in tsconfig.json
- ✅ Use interfaces for object shapes
- ✅ Avoid `any` type
- ✅ Use `unknown` instead of `any` when type is uncertain
- ✅ Use type inference when possible
- ✅ Use readonly for immutable data
- ✅ Use enums for fixed sets of values

## Common Pitfalls

- ⚠️ **Don't use `any` unnecessarily** - Defeats the purpose of TypeScript
- ⚠️ **Don't ignore type errors** - Fix them properly
- ⚠️ **Don't use type assertions without reason** - Can hide bugs
- ⚠️ **Don't forget null checks** - Use optional chaining and nullish coalescing

## Related Topics

- [Advanced Types](./advanced.md)
- [Generics](./generics.md)
- [TypeScript with React](./with-react.md)

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/basic-types.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
