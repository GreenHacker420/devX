# JavaScript String Methods

Built-in methods for working with strings in JavaScript.

## 🔹 Case Conversion

### toUpperCase() / toLowerCase()
```js
const str = "Hello World";
console.log(str.toUpperCase()); // "HELLO WORLD"
console.log(str.toLowerCase()); // "hello world"
```

## 🔹 Searching & Checking

### includes() - Check if substring exists
```js
const str = "Hello World";
console.log(str.includes("World")); // true
console.log(str.includes("world")); // false (case-sensitive)
console.log(str.includes("o", 5));  // true (start from index 5)
```

### startsWith() / endsWith()
```js
const str = "Hello World";
console.log(str.startsWith("Hello")); // true
console.log(str.endsWith("World"));   // true
console.log(str.startsWith("World", 6)); // true (from index 6)
```

### indexOf() - Find first occurrence
```js
const str = "Hello World";
console.log(str.indexOf("o"));      // 4
console.log(str.indexOf("o", 5));   // 7 (start from index 5)
console.log(str.indexOf("xyz"));    // -1 (not found)
```

### lastIndexOf() - Find last occurrence
```js
const str = "Hello World";
console.log(str.lastIndexOf("o")); // 7
console.log(str.lastIndexOf("l")); // 9
```

### search() - Search with regex
```js
const str = "Hello World 123";
console.log(str.search(/\d+/));    // 12 (position of first digit)
console.log(str.search(/world/i)); // 6 (case-insensitive)
```

## 🔹 Extracting Substrings

### slice() - Extract portion
```js
const str = "Hello World";
console.log(str.slice(0, 5));   // "Hello"
console.log(str.slice(6));      // "World"
console.log(str.slice(-5));     // "World" (from end)
console.log(str.slice(-5, -1)); // "Worl"
```

### substring() - Similar to slice (no negative indices)
```js
const str = "Hello World";
console.log(str.substring(0, 5)); // "Hello"
console.log(str.substring(6));    // "World"
```

### substr() - Extract from start position (deprecated)
```js
const str = "Hello World";
console.log(str.substr(6, 5)); // "World" (start at 6, length 5)
```

### charAt() - Get character at index
```js
const str = "Hello";
console.log(str.charAt(0)); // "H"
console.log(str.charAt(4)); // "o"
console.log(str[0]);        // "H" (bracket notation)
```

### charCodeAt() - Get character code
```js
const str = "ABC";
console.log(str.charCodeAt(0)); // 65 (A)
console.log(str.charCodeAt(1)); // 66 (B)
```

## 🔹 Modifying Strings

### replace() - Replace first occurrence
```js
const str = "Hello World World";
console.log(str.replace("World", "JavaScript")); // "Hello JavaScript World"

// With regex (global)
console.log(str.replace(/World/g, "JS")); // "Hello JS JS"

// With function
const result = str.replace(/\w+/g, match => match.toUpperCase());
console.log(result); // "HELLO WORLD WORLD"
```

### replaceAll() - Replace all occurrences
```js
const str = "Hello World World";
console.log(str.replaceAll("World", "JS")); // "Hello JS JS"
```

### trim() / trimStart() / trimEnd()
```js
const str = "  Hello World  ";
console.log(str.trim());      // "Hello World"
console.log(str.trimStart()); // "Hello World  "
console.log(str.trimEnd());   // "  Hello World"
```

### padStart() / padEnd()
```js
const str = "5";
console.log(str.padStart(3, "0")); // "005"
console.log(str.padEnd(3, "0"));   // "500"

const time = "9";
console.log(time.padStart(2, "0")); // "09"
```

### repeat()
```js
const str = "Ha";
console.log(str.repeat(3)); // "HaHaHa"
```

## 🔹 Splitting & Joining

### split() - Convert to array
```js
const str = "apple,banana,cherry";
console.log(str.split(","));  // ["apple", "banana", "cherry"]

const str2 = "Hello World";
console.log(str2.split(" ")); // ["Hello", "World"]
console.log(str2.split(""));  // ["H", "e", "l", "l", "o", " ", "W", "o", "r", "l", "d"]

// Limit results
console.log(str.split(",", 2)); // ["apple", "banana"]
```

### concat() - Combine strings
```js
const str1 = "Hello";
const str2 = "World";
console.log(str1.concat(" ", str2)); // "Hello World"

// Using + or template literals is more common
console.log(str1 + " " + str2);      // "Hello World"
console.log(`${str1} ${str2}`);      // "Hello World"
```

## 🔹 Pattern Matching

### match() - Match against regex
```js
const str = "The year is 2024";
console.log(str.match(/\d+/));    // ["2024"]
console.log(str.match(/\d+/g));   // ["2024"] (global)

const str2 = "abc 123 def 456";
console.log(str2.match(/\d+/g));  // ["123", "456"]
```

### matchAll() - Get all matches with details
```js
const str = "test1 test2 test3";
const matches = [...str.matchAll(/test(\d)/g)];
console.log(matches);
// [
//   ["test1", "1", index: 0, ...],
//   ["test2", "2", index: 6, ...],
//   ["test3", "3", index: 12, ...]
// ]
```

## 🔹 Other Useful Methods

### length - Get string length
```js
const str = "Hello";
console.log(str.length); // 5
```

### at() - Get character at index (supports negative)
```js
const str = "Hello";
console.log(str.at(0));   // "H"
console.log(str.at(-1));  // "o" (last character)
console.log(str.at(-2));  // "l"
```

### String.fromCharCode() - Create string from char codes
```js
console.log(String.fromCharCode(72, 101, 108, 108, 111)); // "Hello"
```

### localeCompare() - Compare strings
```js
const a = "apple";
const b = "banana";
console.log(a.localeCompare(b)); // -1 (a comes before b)
console.log(b.localeCompare(a)); // 1 (b comes after a)
console.log(a.localeCompare(a)); // 0 (equal)
```

## 💡 Tips

- Strings are **immutable** - methods return new strings
- Use **template literals** for string interpolation: `` `Hello ${name}` ``
- **trim()** is useful for cleaning user input
- **split()** and **join()** are commonly used together
- **includes()** is clearer than **indexOf() !== -1**

## 🧩 Example: String Utilities

```js
// Capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
console.log(capitalize("hello")); // "Hello"

// Title case
function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => capitalize(word))
    .join(" ");
}
console.log(titleCase("hello world")); // "Hello World"

// Truncate with ellipsis
function truncate(str, maxLength) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}
console.log(truncate("This is a long string", 10)); // "This is..."

// Count occurrences
function countOccurrences(str, substring) {
  return (str.match(new RegExp(substring, "g")) || []).length;
}
console.log(countOccurrences("hello world", "l")); // 3

// Reverse string
function reverse(str) {
  return str.split("").reverse().join("");
}
console.log(reverse("hello")); // "olleh"

// Check if palindrome
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === reverse(cleaned);
}
console.log(isPalindrome("A man a plan a canal Panama")); // true
```

## 🧩 Example: URL Slug

```js
function createSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")  // Remove special chars
    .replace(/\s+/g, "-")      // Replace spaces with -
    .replace(/-+/g, "-");      // Remove duplicate -
}

console.log(createSlug("Hello World! This is a Test")); 
// "hello-world-this-is-a-test"
```

## ⚠️ Common Mistakes

❌ **Treating strings as mutable**
```js
const str = "Hello";
str[0] = "h"; // Doesn't work!
console.log(str); // "Hello" (unchanged)
```

✅ **Create new string:**
```js
const str = "Hello";
const newStr = "h" + str.slice(1);
console.log(newStr); // "hello"
```

❌ **Forgetting replace() only replaces first occurrence**
```js
const str = "foo foo foo";
console.log(str.replace("foo", "bar")); // "bar foo foo"
```

✅ **Use replaceAll() or regex with g flag:**
```js
console.log(str.replaceAll("foo", "bar")); // "bar bar bar"
console.log(str.replace(/foo/g, "bar"));   // "bar bar bar"
```

## 🔗 See Also

- [Array Methods](./array-methods.md)
- [Object Methods](./object-methods.md)
