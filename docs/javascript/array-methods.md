# JavaScript Array Methods

Arrays come with powerful built-in methods for manipulation, transformation, and iteration.

## 🔹 Adding/Removing Elements

### push() - Add to end
```js
const arr = [1, 2, 3];
arr.push(4, 5);
console.log(arr); // [1, 2, 3, 4, 5]
```

### pop() - Remove from end
```js
const arr = [1, 2, 3];
const last = arr.pop();
console.log(last); // 3
console.log(arr);  // [1, 2]
```

### unshift() - Add to start
```js
const arr = [2, 3];
arr.unshift(0, 1);
console.log(arr); // [0, 1, 2, 3]
```

### shift() - Remove from start
```js
const arr = [1, 2, 3];
const first = arr.shift();
console.log(first); // 1
console.log(arr);   // [2, 3]
```

### splice() - Add/remove at any position
```js
const arr = [1, 2, 5, 6];
arr.splice(2, 0, 3, 4); // At index 2, remove 0, add 3, 4
console.log(arr); // [1, 2, 3, 4, 5, 6]

arr.splice(1, 2); // At index 1, remove 2 elements
console.log(arr); // [1, 4, 5, 6]
```

## 🔹 Transformation Methods

### map() - Transform each element
```js
const nums = [1, 2, 3, 4];
const doubled = nums.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8]

const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 }
];
const names = users.map(user => user.name);
console.log(names); // ["Alice", "Bob"]
```

### filter() - Keep elements matching condition
```js
const nums = [1, 2, 3, 4, 5, 6];
const evens = nums.filter(n => n % 2 === 0);
console.log(evens); // [2, 4, 6]

const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 17 },
  { name: "Charlie", age: 30 }
];
const adults = users.filter(user => user.age >= 18);
console.log(adults); // [{ name: "Alice", age: 25 }, { name: "Charlie", age: 30 }]
```

### reduce() - Accumulate to single value
```js
// Sum
const nums = [1, 2, 3, 4];
const sum = nums.reduce((acc, n) => acc + n, 0);
console.log(sum); // 10

// Max value
const max = nums.reduce((acc, n) => Math.max(acc, n));
console.log(max); // 4

// Group by property
const users = [
  { name: "Alice", role: "admin" },
  { name: "Bob", role: "user" },
  { name: "Charlie", role: "admin" }
];
const grouped = users.reduce((acc, user) => {
  if (!acc[user.role]) acc[user.role] = [];
  acc[user.role].push(user);
  return acc;
}, {});
console.log(grouped);
// { admin: [{...}, {...}], user: [{...}] }
```

### flat() - Flatten nested arrays
```js
const nested = [1, [2, 3], [4, [5, 6]]];
console.log(nested.flat());    // [1, 2, 3, 4, [5, 6]]
console.log(nested.flat(2));   // [1, 2, 3, 4, 5, 6]
console.log(nested.flat(Infinity)); // Flatten all levels
```

### flatMap() - Map then flatten
```js
const arr = [1, 2, 3];
const result = arr.flatMap(n => [n, n * 2]);
console.log(result); // [1, 2, 2, 4, 3, 6]
```

## 🔹 Searching Methods

### find() - First element matching condition
```js
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" }
];
const user = users.find(u => u.id === 2);
console.log(user); // { id: 2, name: "Bob" }
```

### findIndex() - Index of first match
```js
const nums = [10, 20, 30, 40];
const index = nums.findIndex(n => n > 25);
console.log(index); // 2
```

### indexOf() - Index of value
```js
const arr = ["a", "b", "c", "b"];
console.log(arr.indexOf("b"));    // 1
console.log(arr.indexOf("b", 2)); // 3 (start from index 2)
console.log(arr.indexOf("z"));    // -1 (not found)
```

### includes() - Check if value exists
```js
const arr = [1, 2, 3, 4];
console.log(arr.includes(3));  // true
console.log(arr.includes(10)); // false
```

### some() - Check if any element matches
```js
const nums = [1, 2, 3, 4];
console.log(nums.some(n => n > 3));  // true
console.log(nums.some(n => n > 10)); // false
```

### every() - Check if all elements match
```js
const nums = [2, 4, 6, 8];
console.log(nums.every(n => n % 2 === 0)); // true
console.log(nums.every(n => n > 5));       // false
```

## 🔹 Iteration Methods

### forEach() - Execute function for each element
```js
const nums = [1, 2, 3];
nums.forEach((num, index) => {
  console.log(`Index ${index}: ${num}`);
});
// Index 0: 1
// Index 1: 2
// Index 2: 3
```

## 🔹 Sorting & Reversing

### sort() - Sort array (mutates original)
```js
const nums = [3, 1, 4, 1, 5];
nums.sort();
console.log(nums); // [1, 1, 3, 4, 5]

// Custom comparator
const nums2 = [10, 5, 40, 25];
nums2.sort((a, b) => a - b); // Ascending
console.log(nums2); // [5, 10, 25, 40]

nums2.sort((a, b) => b - a); // Descending
console.log(nums2); // [40, 25, 10, 5]

// Sort objects
const users = [
  { name: "Charlie", age: 30 },
  { name: "Alice", age: 25 },
  { name: "Bob", age: 35 }
];
users.sort((a, b) => a.age - b.age);
console.log(users); // Sorted by age
```

### reverse() - Reverse array (mutates original)
```js
const arr = [1, 2, 3, 4];
arr.reverse();
console.log(arr); // [4, 3, 2, 1]
```

## 🔹 Copying & Combining

### slice() - Extract portion (doesn't mutate)
```js
const arr = [1, 2, 3, 4, 5];
const sliced = arr.slice(1, 4);
console.log(sliced); // [2, 3, 4]
console.log(arr);    // [1, 2, 3, 4, 5] (unchanged)

// Copy array
const copy = arr.slice();
```

### concat() - Combine arrays
```js
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = arr1.concat(arr2, [5, 6]);
console.log(combined); // [1, 2, 3, 4, 5, 6]

// Using spread
const combined2 = [...arr1, ...arr2];
```

### join() - Convert to string
```js
const arr = ["Hello", "World"];
console.log(arr.join(" "));  // "Hello World"
console.log(arr.join("-"));  // "Hello-World"
console.log(arr.join(""));   // "HelloWorld"
```

## 🔹 Other Useful Methods

### fill() - Fill with value
```js
const arr = new Array(5).fill(0);
console.log(arr); // [0, 0, 0, 0, 0]

const arr2 = [1, 2, 3, 4, 5];
arr2.fill(0, 2, 4); // Fill from index 2 to 4
console.log(arr2); // [1, 2, 0, 0, 5]
```

### Array.from() - Create array from iterable
```js
const str = "hello";
const arr = Array.from(str);
console.log(arr); // ["h", "e", "l", "l", "o"]

const range = Array.from({ length: 5 }, (_, i) => i + 1);
console.log(range); // [1, 2, 3, 4, 5]
```

### Array.isArray() - Check if array
```js
console.log(Array.isArray([1, 2, 3])); // true
console.log(Array.isArray("hello"));   // false
console.log(Array.isArray({ 0: 1 }));  // false
```

## 📊 Quick Reference Table

| Method | Returns | Mutates | Description |
|--------|---------|---------|-------------|
| `push()` | New length | ✅ | Add to end |
| `pop()` | Removed item | ✅ | Remove from end |
| `shift()` | Removed item | ✅ | Remove from start |
| `unshift()` | New length | ✅ | Add to start |
| `splice()` | Removed items | ✅ | Add/remove at position |
| `map()` | New array | ❌ | Transform elements |
| `filter()` | New array | ❌ | Keep matching elements |
| `reduce()` | Single value | ❌ | Accumulate |
| `find()` | Element or undefined | ❌ | First match |
| `findIndex()` | Index or -1 | ❌ | Index of first match |
| `includes()` | Boolean | ❌ | Check existence |
| `some()` | Boolean | ❌ | Any match |
| `every()` | Boolean | ❌ | All match |
| `sort()` | Sorted array | ✅ | Sort |
| `reverse()` | Reversed array | ✅ | Reverse |
| `slice()` | New array | ❌ | Extract portion |
| `concat()` | New array | ❌ | Combine arrays |

## 💡 Tips

- **map()** returns new array, **forEach()** returns undefined
- **filter()** keeps elements, doesn't transform them
- **reduce()** is very powerful - can do sum, average, grouping, flattening
- **sort()** mutates the original array
- Always provide comparator to **sort()** for numbers

## ⚠️ Common Mistakes

❌ **Forgetting to return in map/filter**
```js
const doubled = nums.map(n => { n * 2 }); // Missing return!
```

✅ **Return the value:**
```js
const doubled = nums.map(n => n * 2); // Implicit return
// OR
const doubled = nums.map(n => { return n * 2 }); // Explicit return
```

❌ **Sorting numbers without comparator**
```js
const nums = [10, 5, 40, 25];
nums.sort(); // [10, 25, 40, 5] - Wrong! Sorts as strings
```

✅ **Use comparator:**
```js
nums.sort((a, b) => a - b); // [5, 10, 25, 40]
```

## 🔗 See Also

- [Arrays](./arrays.md)
- [Object Methods](./object-methods.md)
- [String Methods](./string-methods.md)
