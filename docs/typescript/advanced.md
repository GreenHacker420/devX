# TypeScript Advanced Types

Master advanced TypeScript features and patterns.

## Generics

### Basic Generics

```typescript
function identity<T>(arg: T): T {
  return arg
}

let output1 = identity<string>("hello")
let output2 = identity<number>(42)
let output3 = identity("auto")  // Type inference
```

### Generic Interfaces

```typescript
interface Box<T> {
  value: T
}

let stringBox: Box<string> = { value: "hello" }
let numberBox: Box<number> = { value: 42 }
```

### Generic Classes

```typescript
class GenericNumber<T> {
  zeroValue: T
  add: (x: T, y: T) => T

  constructor(zeroValue: T, add: (x: T, y: T) => T) {
    this.zeroValue = zeroValue
    this.add = add
  }
}

let myGenericNumber = new GenericNumber<number>(0, (x, y) => x + y)
```

### Generic Constraints

```typescript
interface Lengthwise {
  length: number
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}

logLength("hello")           // OK
logLength([1, 2, 3])         // OK
logLength({ length: 10 })    // OK
// logLength(42)             // Error: number doesn't have length
```

### Multiple Type Parameters

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 }
}

let result = merge({ name: "Alice" }, { age: 25 })
// result: { name: string; age: number }
```

### Generic Utility Functions

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

let person = { name: "Alice", age: 25 }
let name = getProperty(person, "name")  // string
let age = getProperty(person, "age")    // number
```

## Utility Types

### Partial<T>

Makes all properties optional:

```typescript
interface User {
  id: number
  name: string
  email: string
}

type PartialUser = Partial<User>
// { id?: number; name?: string; email?: string }

function updateUser(user: User, updates: Partial<User>): User {
  return { ...user, ...updates }
}
```

### Required<T>

Makes all properties required:

```typescript
interface User {
  id?: number
  name?: string
}

type RequiredUser = Required<User>
// { id: number; name: string }
```

### Readonly<T>

Makes all properties readonly:

```typescript
interface User {
  id: number
  name: string
}

type ReadonlyUser = Readonly<User>

let user: ReadonlyUser = { id: 1, name: "Alice" }
// user.name = "Bob"  // Error: Cannot assign to 'name'
```

### Record<K, T>

Creates an object type with keys K and values T:

```typescript
type Role = "admin" | "user" | "guest"

type Permissions = Record<Role, string[]>

let permissions: Permissions = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"]
}
```

### Pick<T, K>

Creates a type by picking properties from T:

```typescript
interface User {
  id: number
  name: string
  email: string
  password: string
}

type PublicUser = Pick<User, "id" | "name" | "email">
// { id: number; name: string; email: string }
```

### Omit<T, K>

Creates a type by omitting properties from T:

```typescript
interface User {
  id: number
  name: string
  email: string
  password: string
}

type UserWithoutPassword = Omit<User, "password">
// { id: number; name: string; email: string }
```

### Exclude<T, U>

Excludes types from a union:

```typescript
type T = Exclude<"a" | "b" | "c", "a">
// "b" | "c"

type T2 = Exclude<string | number | boolean, string>
// number | boolean
```

### Extract<T, U>

Extracts types from a union:

```typescript
type T = Extract<"a" | "b" | "c", "a" | "f">
// "a"

type T2 = Extract<string | number | boolean, string | number>
// string | number
```

### NonNullable<T>

Removes null and undefined:

```typescript
type T = NonNullable<string | number | null | undefined>
// string | number
```

### ReturnType<T>

Gets the return type of a function:

```typescript
function getUser() {
  return { id: 1, name: "Alice" }
}

type User = ReturnType<typeof getUser>
// { id: number; name: string }
```

### Parameters<T>

Gets the parameter types of a function:

```typescript
function createUser(name: string, age: number) {
  return { name, age }
}

type CreateUserParams = Parameters<typeof createUser>
// [name: string, age: number]
```

### Awaited<T>

Unwraps Promise types:

```typescript
type A = Awaited<Promise<string>>
// string

type B = Awaited<Promise<Promise<number>>>
// number
```

## Conditional Types

### Basic Conditional Types

```typescript
type IsString<T> = T extends string ? true : false

type A = IsString<string>  // true
type B = IsString<number>  // false
```

### Nested Conditional Types

```typescript
type TypeName<T> =
  T extends string ? "string" :
  T extends number ? "number" :
  T extends boolean ? "boolean" :
  T extends undefined ? "undefined" :
  T extends Function ? "function" :
  "object"

type T1 = TypeName<string>    // "string"
type T2 = TypeName<number>    // "number"
type T3 = TypeName<() => void> // "function"
```

### Distributive Conditional Types

```typescript
type ToArray<T> = T extends any ? T[] : never

type T = ToArray<string | number>
// string[] | number[]
```

### Infer Keyword

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type T1 = ReturnType<() => string>  // string
type T2 = ReturnType<() => number>  // number

// Extract array element type
type ElementType<T> = T extends (infer E)[] ? E : never

type T3 = ElementType<string[]>  // string
type T4 = ElementType<number[]>  // number
```

## Mapped Types

### Basic Mapped Types

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

type Optional<T> = {
  [P in keyof T]?: T[P]
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null
}
```

### Key Remapping

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

interface Person {
  name: string
  age: number
}

type PersonGetters = Getters<Person>
// {
//   getName: () => string
//   getAge: () => number
// }
```

### Filtering Properties

```typescript
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K]
}

interface User {
  id: number
  name: string
  age: number
  email: string
}

type StringProps = PickByType<User, string>
// { name: string; email: string }
```

## Template Literal Types

### Basic Template Literals

```typescript
type World = "world"
type Greeting = `hello ${World}`  // "hello world"

type EmailLocale = "en" | "es" | "fr"
type EmailType = "welcome" | "reset"
type EmailTemplate = `${EmailLocale}_${EmailType}`
// "en_welcome" | "en_reset" | "es_welcome" | "es_reset" | "fr_welcome" | "fr_reset"
```

### String Manipulation Types

```typescript
type Uppercase<S extends string> = intrinsic
type Lowercase<S extends string> = intrinsic
type Capitalize<S extends string> = intrinsic
type Uncapitalize<S extends string> = intrinsic

type T1 = Uppercase<"hello">      // "HELLO"
type T2 = Lowercase<"HELLO">      // "hello"
type T3 = Capitalize<"hello">     // "Hello"
type T4 = Uncapitalize<"Hello">   // "hello"
```

### Event Handler Pattern

```typescript
type PropEventSource<T> = {
  on<K extends string & keyof T>(
    eventName: `${K}Changed`,
    callback: (newValue: T[K]) => void
  ): void
}

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>

let person = makeWatchedObject({
  firstName: "Alice",
  age: 25
})

person.on("firstNameChanged", (newName) => {
  console.log(newName.toUpperCase())
})
```

## Type Guards

### typeof Type Guards

```typescript
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + value
  }
  return padding + value
}
```

### instanceof Type Guards

```typescript
class Bird {
  fly() {
    console.log("Flying")
  }
}

class Fish {
  swim() {
    console.log("Swimming")
  }
}

function move(animal: Bird | Fish) {
  if (animal instanceof Bird) {
    animal.fly()
  } else {
    animal.swim()
  }
}
```

### Custom Type Guards

```typescript
interface Cat {
  meow(): void
}

interface Dog {
  bark(): void
}

function isCat(animal: Cat | Dog): animal is Cat {
  return (animal as Cat).meow !== undefined
}

function makeSound(animal: Cat | Dog) {
  if (isCat(animal)) {
    animal.meow()
  } else {
    animal.bark()
  }
}
```

### Discriminated Unions

```typescript
interface Circle {
  kind: "circle"
  radius: number
}

interface Square {
  kind: "square"
  sideLength: number
}

type Shape = Circle | Square

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2
    case "square":
      return shape.sideLength ** 2
  }
}
```

## Index Types

### keyof Operator

```typescript
interface Person {
  name: string
  age: number
}

type PersonKeys = keyof Person  // "name" | "age"

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
```

### Indexed Access Types

```typescript
interface Person {
  name: string
  age: number
  address: {
    street: string
    city: string
  }
}

type Name = Person["name"]  // string
type Address = Person["address"]  // { street: string; city: string }
type City = Person["address"]["city"]  // string
```

## Decorators

### Class Decorators

```typescript
function sealed(constructor: Function) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

@sealed
class Greeter {
  greeting: string
  constructor(message: string) {
    this.greeting = message
  }
}
```

### Method Decorators

```typescript
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args)
    const result = originalMethod.apply(this, args)
    console.log(`Result:`, result)
    return result
  }

  return descriptor
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b
  }
}
```

### Property Decorators

```typescript
function readonly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false
  })
}

class Person {
  @readonly
  name: string = "Alice"
}
```

## Namespace

```typescript
namespace Validation {
  export interface StringValidator {
    isValid(s: string): boolean
  }

  export class EmailValidator implements StringValidator {
    isValid(s: string): boolean {
      return /\S+@\S+\.\S+/.test(s)
    }
  }
}

let validator = new Validation.EmailValidator()
```

## Declaration Merging

### Interface Merging

```typescript
interface Box {
  height: number
  width: number
}

interface Box {
  depth: number
}

let box: Box = {
  height: 5,
  width: 6,
  depth: 7
}
```

### Namespace Merging

```typescript
namespace Animals {
  export class Dog {}
}

namespace Animals {
  export class Cat {}
}

// Both Dog and Cat are available
let dog = new Animals.Dog()
let cat = new Animals.Cat()
```

## Module Augmentation

```typescript
// Extend existing module
import { Observable } from "rxjs"

declare module "rxjs" {
  interface Observable<T> {
    customMethod(): Observable<T>
  }
}

Observable.prototype.customMethod = function () {
  return this
}
```

## Best Practices

- ✅ Use generics for reusable components
- ✅ Leverage utility types instead of creating custom ones
- ✅ Use conditional types for complex type logic
- ✅ Use discriminated unions for type-safe state management
- ✅ Create custom type guards for better type narrowing
- ✅ Use mapped types for transforming object types
- ✅ Prefer type inference over explicit types when possible

## Common Patterns

### Builder Pattern

```typescript
class UserBuilder {
  private user: Partial<User> = {}

  setName(name: string): this {
    this.user.name = name
    return this
  }

  setEmail(email: string): this {
    this.user.email = email
    return this
  }

  build(): User {
    return this.user as User
  }
}

let user = new UserBuilder()
  .setName("Alice")
  .setEmail("alice@example.com")
  .build()
```

### Factory Pattern

```typescript
interface Shape {
  draw(): void
}

class Circle implements Shape {
  draw() {
    console.log("Drawing circle")
  }
}

class Square implements Shape {
  draw() {
    console.log("Drawing square")
  }
}

class ShapeFactory {
  static createShape(type: "circle" | "square"): Shape {
    switch (type) {
      case "circle":
        return new Circle()
      case "square":
        return new Square()
    }
  }
}
```

## Related Topics

- [Basics](./basics.md)
- [Generics](./generics.md)
- [TypeScript with React](./with-react.md)

## References

- [Advanced Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
