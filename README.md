# Summary

Two classes of object are provided: ValueSet and ValueMap. They have similar interfaces to JavaScript's [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) and [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map). ValueSet and ValueMap allow equality of keys to be customized and by default key equality is based on [lodash's](https://lodash.com/) isEqual function, meaning object equality has value rather than reference semantics. In contrast, key equality for the predefined Set and Map objects is based on the "SameValueZero" algorithm, meaning objects are equal if they are the same object.

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

JavaScript does not enumerate its object properties in a particular order. ValueMap and ValueSet computes hash values for objects and their properties without first sorting the properties. See the comments in the source code for details.
