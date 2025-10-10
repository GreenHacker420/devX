# JavaScript Prototypes

Prototypes are the mechanism by which JavaScript objects inherit features from one another.

## 🔹 What is a Prototype?

Every JavaScript object has an internal property called `[[Prototype]]` (accessed via `__proto__` or `Object.getPrototypeOf()`).

```js
const obj = { name: "Alice" };

console.log(obj.__proto__); // Object.prototype
console.log(Object.getPrototypeOf(obj)); // Object.prototype
```

## 🔹 Prototype Chain

When you access a property, JavaScript looks for it in:
1. The object itself
2. The object's prototype
3. The prototype's prototype
4. ... until it reaches `null`

```js
const animal = {
  eats: true,
  walk() {
    console.log("Animal walks");
  }
};

const rabbit = {
  jumps: true
};

// Set animal as prototype of rabbit
rabbit.__proto__ = animal;

console.log(rabbit.eats);  // true (from prototype)
console.log(rabbit.jumps); // true (own property)
rabbit.walk();             // "Animal walks" (from prototype)
```

## 🔹 Constructor Functions

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Add methods to prototype
Person.prototype.greet = function() {
  console.log(`Hi, I'm ${this.name}`);
};

Person.prototype.getAge = function() {
  return this.age;
};

const alice = new Person("Alice", 25);
const bob = new Person("Bob", 30);

alice.greet(); // "Hi, I'm Alice"
bob.greet();   // "Hi, I'm Bob"

// Both instances share the same prototype
console.log(alice.greet === bob.greet); // true
```

## 🔹 Object.create()

Create an object with a specific prototype.

```js
const personPrototype = {
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

const alice = Object.create(personPrototype);
alice.name = "Alice";
alice.greet(); // "Hello, I'm Alice"
```

## 🔹 Checking Prototypes

```js
function Person(name) {
  this.name = name;
}

const alice = new Person("Alice");

// Check if object is instance of constructor
console.log(alice instanceof Person); // true

// Check if object has a property (own or inherited)
console.log("name" in alice); // true

// Check if object has own property (not inherited)
console.log(alice.hasOwnProperty("name")); // true
console.log(alice.hasOwnProperty("toString")); // false (inherited)

// Get prototype
console.log(Object.getPrototypeOf(alice) === Person.prototype); // true
```

## 🔹 Inheritance with Prototypes

```js
// Parent constructor
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  console.log(`${this.name} is eating`);
};

// Child constructor
function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// Add child-specific methods
Dog.prototype.bark = function() {
  console.log(`${this.name} says Woof!`);
};

const dog = new Dog("Buddy", "Golden Retriever");
dog.eat();  // "Buddy is eating" (inherited)
dog.bark(); // "Buddy says Woof!" (own method)
```

## 🔹 Built-in Prototypes

```js
// Array.prototype
const arr = [1, 2, 3];
console.log(arr.__proto__ === Array.prototype); // true

// String.prototype
const str = "hello";
console.log(str.__proto__ === String.prototype); // true

// Function.prototype
function fn() {}
console.log(fn.__proto__ === Function.prototype); // true
```

## 🔹 Adding Methods to Built-in Prototypes

⚠️ **Generally not recommended**, but possible:

```js
// Add custom method to Array
Array.prototype.first = function() {
  return this[0];
};

const arr = [1, 2, 3];
console.log(arr.first()); // 1

// Better approach: create utility function
function first(arr) {
  return arr[0];
}
```

## 💡 Tips

- Prototypes enable **memory-efficient** method sharing
- All instances share the same prototype methods
- Use `Object.create()` for cleaner prototype inheritance
- Modern JavaScript uses **classes** (which use prototypes under the hood)
- Don't modify built-in prototypes (can cause conflicts)

## 🧩 Example: Creating a Custom Array-like Object

```js
function MyArray() {
  this.length = 0;
}

MyArray.prototype.push = function(item) {
  this[this.length] = item;
  this.length++;
  return this.length;
};

MyArray.prototype.pop = function() {
  if (this.length === 0) return undefined;
  
  const item = this[this.length - 1];
  delete this[this.length - 1];
  this.length--;
  return item;
};

MyArray.prototype.toString = function() {
  return `[${Object.values(this).slice(0, -1).join(", ")}]`;
};

const arr = new MyArray();
arr.push(1);
arr.push(2);
arr.push(3);
console.log(arr.toString()); // "[1, 2, 3]"
console.log(arr.pop());      // 3
console.log(arr.toString()); // "[1, 2]"
```

## ⚠️ Common Mistakes

❌ **Forgetting to set constructor**
```js
function Child() {}
Child.prototype = Object.create(Parent.prototype);
// Forgot: Child.prototype.constructor = Child;

const child = new Child();
console.log(child.constructor); // Points to Parent, not Child!
```

✅ **Always reset constructor:**
```js
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
```

❌ **Modifying prototype after creating instances**
```js
function Person(name) {
  this.name = name;
}

const alice = new Person("Alice");

Person.prototype.greet = function() {
  console.log(`Hi, I'm ${this.name}`);
};

alice.greet(); // Works, but can be confusing
```

✅ **Define all prototype methods before creating instances:**
```js
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  console.log(`Hi, I'm ${this.name}`);
};

const alice = new Person("Alice");
alice.greet();
```

❌ **Assigning object directly to prototype**
```js
Child.prototype = Parent.prototype; // Both point to same object!
```

✅ **Use Object.create():**
```js
Child.prototype = Object.create(Parent.prototype);
```

## 🔗 See Also

- [Classes](./classes.md)
- [Objects](./objects.md)
- [Functions](./functions.md)
