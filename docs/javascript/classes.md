# JavaScript Classes

Classes are a template for creating objects. They're syntactic sugar over JavaScript's prototype-based inheritance.

## 🔹 Basic Class

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    console.log(`Hi, I'm ${this.name}`);
  }
  
  getAge() {
    return this.age;
  }
}

const alice = new Person("Alice", 25);
alice.greet(); // "Hi, I'm Alice"
console.log(alice.getAge()); // 25
```

## 🔹 Constructor

The `constructor` method is called when creating a new instance.

```js
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  
  getArea() {
    return this.width * this.height;
  }
}

const rect = new Rectangle(10, 5);
console.log(rect.getArea()); // 50
```

## 🔹 Methods

```js
class Calculator {
  constructor() {
    this.result = 0;
  }
  
  add(value) {
    this.result += value;
    return this; // Enable chaining
  }
  
  subtract(value) {
    this.result -= value;
    return this;
  }
  
  getResult() {
    return this.result;
  }
}

const calc = new Calculator();
calc.add(10).subtract(3).add(5);
console.log(calc.getResult()); // 12
```

## 🔹 Getters and Setters

```js
class Circle {
  constructor(radius) {
    this._radius = radius;
  }
  
  get radius() {
    return this._radius;
  }
  
  set radius(value) {
    if (value <= 0) {
      throw new Error("Radius must be positive");
    }
    this._radius = value;
  }
  
  get area() {
    return Math.PI * this._radius ** 2;
  }
  
  get circumference() {
    return 2 * Math.PI * this._radius;
  }
}

const circle = new Circle(5);
console.log(circle.radius);        // 5
console.log(circle.area);          // 78.54...
circle.radius = 10;
console.log(circle.circumference); // 62.83...
```

## 🔹 Static Methods

Static methods belong to the class itself, not instances.

```js
class MathUtils {
  static add(a, b) {
    return a + b;
  }
  
  static multiply(a, b) {
    return a * b;
  }
  
  static PI = 3.14159;
}

console.log(MathUtils.add(5, 3));     // 8
console.log(MathUtils.multiply(4, 2)); // 8
console.log(MathUtils.PI);            // 3.14159

// Can't call on instances
const utils = new MathUtils();
// utils.add(1, 2); // Error!
```

## 🔹 Inheritance (extends)

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Call parent constructor
    this.breed = breed;
  }
  
  speak() {
    console.log(`${this.name} barks`);
  }
  
  fetch() {
    console.log(`${this.name} fetches the ball`);
  }
}

const dog = new Dog("Buddy", "Golden Retriever");
dog.speak();  // "Buddy barks"
dog.fetch();  // "Buddy fetches the ball"
```

## 🔹 Super Keyword

```js
class Vehicle {
  constructor(brand) {
    this.brand = brand;
  }
  
  start() {
    console.log(`${this.brand} is starting`);
  }
}

class Car extends Vehicle {
  constructor(brand, model) {
    super(brand); // Call parent constructor
    this.model = model;
  }
  
  start() {
    super.start(); // Call parent method
    console.log(`${this.model} engine is running`);
  }
}

const car = new Car("Toyota", "Camry");
car.start();
// "Toyota is starting"
// "Camry engine is running"
```

## 🔹 Private Fields (ES2022)

```js
class BankAccount {
  #balance = 0; // Private field
  
  constructor(initialBalance) {
    this.#balance = initialBalance;
  }
  
  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
    }
  }
  
  withdraw(amount) {
    if (amount > 0 && amount <= this.#balance) {
      this.#balance -= amount;
      return amount;
    }
    return 0;
  }
  
  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount(100);
account.deposit(50);
console.log(account.getBalance()); // 150
// console.log(account.#balance);  // Error: Private field
```

## 🔹 Static Blocks (ES2022)

```js
class Config {
  static #apiKey;
  static #initialized = false;
  
  static {
    // Static initialization block
    this.#apiKey = "secret-key-123";
    this.#initialized = true;
    console.log("Config initialized");
  }
  
  static getApiKey() {
    return this.#apiKey;
  }
}

console.log(Config.getApiKey()); // "secret-key-123"
```

## 💡 Tips

- Classes are **NOT hoisted** (unlike function declarations)
- Always use `new` to create instances
- Use `super()` in child constructor before accessing `this`
- Private fields start with `#`
- Static methods are useful for utility functions
- Classes are just syntactic sugar over prototypes

## 🧩 Example: Todo List

```js
class TodoList {
  #todos = [];
  #nextId = 1;
  
  add(text) {
    const todo = {
      id: this.#nextId++,
      text,
      completed: false,
      createdAt: new Date()
    };
    this.#todos.push(todo);
    return todo;
  }
  
  remove(id) {
    const index = this.#todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      return this.#todos.splice(index, 1)[0];
    }
  }
  
  toggle(id) {
    const todo = this.#todos.find(todo => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
    return todo;
  }
  
  getAll() {
    return [...this.#todos]; // Return copy
  }
  
  getCompleted() {
    return this.#todos.filter(todo => todo.completed);
  }
  
  getPending() {
    return this.#todos.filter(todo => !todo.completed);
  }
}

const todos = new TodoList();
todos.add("Learn JavaScript");
todos.add("Build a project");
todos.toggle(1);
console.log(todos.getCompleted()); // [{ id: 1, text: "Learn JavaScript", ... }]
```

## ⚠️ Common Mistakes

❌ **Forgetting `new` keyword**
```js
class Person {
  constructor(name) {
    this.name = name;
  }
}

const person = Person("Alice"); // Error!
```

✅ **Always use `new`:**
```js
const person = new Person("Alice");
```

❌ **Not calling `super()` in child constructor**
```js
class Child extends Parent {
  constructor(name) {
    this.name = name; // Error! Must call super() first
  }
}
```

✅ **Call `super()` first:**
```js
class Child extends Parent {
  constructor(name) {
    super();
    this.name = name;
  }
}
```

❌ **Using arrow functions for methods**
```js
class Person {
  name = "Alice";
  
  greet = () => {
    console.log(this.name); // Works, but not on prototype
  }
}
```

✅ **Use regular methods:**
```js
class Person {
  constructor() {
    this.name = "Alice";
  }
  
  greet() {
    console.log(this.name); // On prototype, more efficient
  }
}
```

## 🔗 See Also

- [Prototypes](./prototypes.md)
- [Objects](./objects.md)
- [Functions](./functions.md)
