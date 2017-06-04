# Raison d'être

Two classes of object are provided: ValueSet and ValueMap. They have similar interfaces to JavaScript's [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) and [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). Key equality for predefined Set and Map objects is based on the "SameValueZero" algorithm, meaning objects are equal if they are the same object. In contrast, ValueSet and ValueMap allow equality of keys to be customized and by default key equality is based on lodash's isEqual function, meaning object equality has value rather than reference semantics.

This might be useful where object keys should be compared for equality property by property, for example if the keys are (X, Y) coordinates.

# Example

```js
// Map doesn't do what we want.
let map = new Map()
map.set({x: 2, y: 3}, "Treasure")

map.has({x: 2, y: 3})  // false
map.get({x: 2, y: 3})  // undefined

// ValueMap to the rescue!
let map = new ValueMap()
map.set({x: 2, y: 3}, "Treasure")

map.has({x: 2, y: 3})  // true
map.get({x: 2, y: 3})  // "Treasure"

```

# Infamy, JavaScript objects and hash functions

JavaScript is well known for not enumerating its object properties in a consistent order. We would like to compute hash values for JavaScript objects, if possible in time linear in the number of keys, i.e. without sorting them. I'll leave the hash function to explain itself.

```js
const SEED = 5381;

// Throughout this file, using (x | 0) to truncate x to a signed 32-bit integer in order to avoid floating point rounding issues.
const hashString = (h, v) => {
  v = String(v)
  for (let i = 0; i < v.length; ++i)
    h = (((h * 33) | 0) + v.charCodeAt(i)) | 0;
  return h;
}

// Must return the same hash value for equal objects, regardless of the order the properies are iterated. Aside
// froom looking at the name of the constrructor function, for objects, this only looks at property values one
// level deep, making it suitable for use with both shallow and deep equality (including lodash isEqual).
const hash = (k) => {
  if (k && typeof k === "object") {
    let h = 0;
    if (typeof k.constructor === "object")
      h = hashString(SEED, k.constructor.name);

    // Property name and value are hashed as a pair. The hash values of all property name/value pairs are summed.
    // Summming the hash values does not make a particularly good hash function but it has the advantage that
    // integer addition is commutative, which means it does not matter in which order the properties are enumerated,
    // something that JavaScript does not guarantee. This is also the reason for bitwise ORing the has values with
    // zero. It keeps them in the 32-bit signed integer range. If they were to stray into the range where they are
    // floating point proper, addition would no longer be commutative because of rounding error.
    for (let n in k) {
      if (has.call(k, n))
        h = (h + hashString(hashString(SEED, n), k[n])) | 0;
    }
    return h;
  } else {
    return hashString(SEED, k);
  }
}

```