# Summary

Two classes of object are provided: ValueSet and ValueMap. They have similar interfaces to JavaScript's [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) and [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). ValueSet and ValueMap allow equality of keys to be customized by overriding their isEqual and getHash methods and by default key equality is based on [lodash's](https://lodash.com/) isEqual function, meaning object equality has value rather than reference semantics. In contrast, key equality for the predefined Set and Map objects is based on the "SameValueZero" algorithm, meaning objects are equal if they are the same object.

## Example

```js
// Map doesn't do what we want.
let map = new Map()
map.set({x: 2, y: 3}, "Treasure")

map.size               // 1
map.has({x: 2, y: 3})  // false
map.get({x: 2, y: 3})  // undefined

// ValueMap to the rescue!
let map = new ValueMap()
map.set({x: 2, y: 3}, "Treasure")

map.size               // 1
map.has({x: 2, y: 3})  // true
map.get({x: 2, y: 3})  // "Treasure"
```

## Hash function

ValueMap and ValueSet compute hash values for objects and their properties such that property enumeration order doesn't affect the hash value. This means the computed hash values do not depend on the property insertion order or other property ordering schemes. This is accomplished in time linear in the number of properties, i.e. without sorting the properties. See the comments relating to the hash function in the source code for details.
