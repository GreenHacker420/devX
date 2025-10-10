# JavaScript Arrays

Arrays are ordered, indexed collections that can hold multiple values of any type.

## 🔹 Creation

```js
const arr = [1, 2, 3];
const arr2 = new Array(4, 5, 6);
const empty = [];
const mixed = [1, "hello", true, { name: "John" }];
```

## 🔹 Accessing Elements

```js
const fruits = ["apple", "banana", "cherry"];
console.log(fruits[0]); // "apple"
console.log(fruits[fruits.length - 1]); // "cherry" (last element)
```

## 🔹 Properties

| Property | Description | Example |
|----------|-------------|---------|
| `length` | Number of elements | `arr.length` |

## 🔹 Common Operations

```js
const nums = [1, 2, 3];

// Add elements
nums.push(4);        // [1, 2, 3, 4] - add to end
nums.unshift(0);     // [0, 1, 2, 3, 4] - add to start

// Remove elements
nums.pop();          // [0, 1, 2, 3] - remove from end
nums.shift();        // [1, 2, 3] - remove from start

// Find elements
nums.includes(2);    // true
nums.indexOf(2);     // 1
nums.find(x => x > 2); // 3
```

## 🔹 Iteration

```js
const arr = [1, 2, 3];

// For loop
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}

// For...of
for (const item of arr) {
  console.log(item);
}

// forEach
arr.forEach((item, index) => {
  console.log(index, item);
});
```

## 💡 Tips

- Arrays are **zero-indexed** (first element is at index 0)
- Arrays can hold **mixed types**
- Use `const` for arrays - you can still modify contents
- Check if something is an array: `Array.isArray(arr)`

## 🧩 Example

```js
const students = ["Alice", "Bob", "Charlie"];

// Add new student
students.push("David");

// Check if student exists
if (students.includes("Bob")) {
  console.log("Bob is enrolled");
}

// Get number of students
console.log(`Total students: ${students.length}`);
```

## ⚠️ Common Mistakes

❌ **Accessing out of bounds** (returns `undefined`, not an error)
```js
const arr = [1, 2, 3];
console.log(arr[10]); // undefined
```

❌ **Modifying array while iterating**
```js
// Dangerous!
arr.forEach((item, i) => {
  arr.splice(i, 1); // Don't do this
});
```

✅ **Correct approach:**
```js
const filtered = arr.filter(item => item !== valueToRemove);
```

## 🔗 See Also

- [Array Methods](./array-methods.md)
- [Objects](./objects.md)
