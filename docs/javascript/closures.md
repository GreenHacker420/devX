# JavaScript Closures

A closure is a function that has access to variables from its outer (enclosing) scope, even after the outer function has returned.

## 🔹 What is a Closure?

```js
function outer() {
  const message = "Hello";
  
  function inner() {
    console.log(message); // Can access 'message' from outer scope
  }
  
  return inner;
}

const myFunction = outer();
myFunction(); // "Hello" - closure in action!
```

## 🔹 How Closures Work

When a function is created, it maintains a reference to its lexical environment (the scope in which it was created).

```js
function createCounter() {
  let count = 0; // Private variable
  
  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount());  // 1
// console.log(counter.count);    // undefined - count is private!
```

## 🔹 Practical Uses

### 1. Data Privacy / Encapsulation

```js
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private variable
  
  return {
    deposit(amount) {
      if (amount > 0) {
        balance += amount;
        return balance;
      }
    },
    withdraw(amount) {
      if (amount > 0 && amount <= balance) {
        balance -= amount;
        return balance;
      }
      return "Insufficient funds";
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(100);
console.log(account.deposit(50));   // 150
console.log(account.withdraw(30));  // 120
console.log(account.getBalance());  // 120
// account.balance = 1000000;       // Can't directly modify balance!
```

### 2. Function Factories

```js
function multiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplier(2);
const triple = multiplier(3);
const quadruple = multiplier(4);

console.log(double(5));     // 10
console.log(triple(5));     // 15
console.log(quadruple(5));  // 20
```

### 3. Event Handlers

```js
function setupButton(buttonId, message) {
  const button = document.getElementById(buttonId);
  
  button.addEventListener("click", function() {
    console.log(message); // Closure over 'message'
  });
}

setupButton("btn1", "Button 1 clicked!");
setupButton("btn2", "Button 2 clicked!");
```

### 4. Memoization (Caching)

```js
function memoize(fn) {
  const cache = {}; // Closure over cache
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (key in cache) {
      console.log("From cache");
      return cache[key];
    }
    
    console.log("Computing...");
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

const expensiveOperation = memoize((n) => {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += i;
  }
  return sum;
});

console.log(expensiveOperation(1000000)); // Computing... 499999500000
console.log(expensiveOperation(1000000)); // From cache 499999500000
```

### 5. Partial Application

```js
function greet(greeting, name) {
  return `${greeting}, ${name}!`;
}

function partial(fn, ...fixedArgs) {
  return function(...remainingArgs) {
    return fn(...fixedArgs, ...remainingArgs);
  };
}

const sayHello = partial(greet, "Hello");
const sayHi = partial(greet, "Hi");

console.log(sayHello("Alice")); // "Hello, Alice!"
console.log(sayHi("Bob"));      // "Hi, Bob!"
```

## 🔹 Closures in Loops

### ❌ Common Mistake

```js
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 3, 3, 3 (not 0, 1, 2!)
  }, 1000);
}
```

### ✅ Solution 1: Use `let`

```js
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 0, 1, 2
  }, 1000);
}
```

### ✅ Solution 2: IIFE

```js
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j); // 0, 1, 2
    }, 1000);
  })(i);
}
```

## 💡 Tips

- Closures are created **every time** a function is created
- They allow for **data privacy** and **encapsulation**
- Be careful with closures in loops (use `let` instead of `var`)
- Closures can cause **memory leaks** if not managed properly
- They're fundamental to many JavaScript patterns (modules, callbacks, etc.)

## 🧩 Example: Module Pattern

```js
const Calculator = (function() {
  // Private variables and functions
  let result = 0;
  
  function log(operation, value) {
    console.log(`${operation}: ${value}, Result: ${result}`);
  }
  
  // Public API
  return {
    add(value) {
      result += value;
      log("Add", value);
      return this;
    },
    subtract(value) {
      result -= value;
      log("Subtract", value);
      return this;
    },
    multiply(value) {
      result *= value;
      log("Multiply", value);
      return this;
    },
    getResult() {
      return result;
    },
    reset() {
      result = 0;
      return this;
    }
  };
})();

Calculator.add(10).multiply(2).subtract(5);
console.log(Calculator.getResult()); // 15
```

## ⚠️ Common Mistakes

❌ **Unintended variable sharing**
```js
const functions = [];
for (var i = 0; i < 3; i++) {
  functions.push(function() {
    return i;
  });
}
console.log(functions[0]()); // 3 (not 0!)
console.log(functions[1]()); // 3 (not 1!)
```

✅ **Use let or create separate scope:**
```js
const functions = [];
for (let i = 0; i < 3; i++) {
  functions.push(function() {
    return i;
  });
}
console.log(functions[0]()); // 0
console.log(functions[1]()); // 1
```

❌ **Memory leaks**
```js
function createHugeArray() {
  const hugeArray = new Array(1000000).fill("data");
  
  return function() {
    // Closure keeps hugeArray in memory even if not used
    console.log("Function called");
  };
}
```

✅ **Only close over what you need:**
```js
function createHugeArray() {
  const hugeArray = new Array(1000000).fill("data");
  const length = hugeArray.length; // Only keep what you need
  
  return function() {
    console.log(`Array had ${length} elements`);
  };
}
```

## 🔗 See Also

- [Functions](./functions.md)
- [Prototypes](./prototypes.md)
- [Classes](./classes.md)
