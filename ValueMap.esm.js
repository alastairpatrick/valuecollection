"use strict";

import isEqual from "lodash.isEqual";

import { hash } from "./hash.esm.js";

const has = Object.prototype.hasOwnProperty;

/**
 * The ValueMap object holds key-value pairs. Any value (both objects and primitive values) may be used as either a key or a value.
 * By default, keys are considered equal using lodash's isEqual, which is deep equality.
 */
class ValueMap extends Map {
  static name = 'ValueMap';

  /**
   * Create a new ValueMap.
   * @param {Iterable} [iterable] An iterable object whose elements are [key, value] pairs to add to the new ValueMap. If you don't specify this parameter, or its value is null, the new ValueMap is empty.
   */
  constructor(iterable) {
    super();
    this.clear();
    if (iterable) {
      for (let [k, v] of iterable)
        this.set(k, v);
    }
  }

  /**
   * Returns the number of elements in a ValueMap object.
   * @returns {number} The number of elements.
   */
  get size() {
    return this.size_;
  }

  /**
   * Adds or updates an element with a specified key and value to a ValueMap object.
   * @param {*} k The key of the element to add to the ValueMap object.
   * @param {*} v The value of the element to add to the ValueMap object.
   * @returns {ValueMap} The ValueMap object.
   */
  set(k, v) {
    let h = this.getHash(k);
    let b = this.hash[h];
    if (b === undefined)
      b = this.hash[h] = [];
    let n = b.find(n => this.isEqual(n.key, k))
    if (n === undefined) {
      b.push({
        key: k,
        value: v,
      });
      ++this.size_;
    } else {
      n.value = v;
    }
    return this;
  }

  /**
   * The has() method returns a boolean indicating whether an element with the specified key exists or not.
   * @param {*} k The key of the element to test for presence in the ValueMap object.
   * @returns {boolean} Returns true if an element with the specified key exists in the ValueMap object; otherwise false.
   */
  has(k) {
    let h = this.getHash(k);
    let b = this.hash[h];
    if (b === undefined)
      return false;
    let ni = b.findIndex(n => this.isEqual(n.key, k))
    return ni >= 0;
  }

  /**
   * The get() method returns a specified element from a ValueMap object.
   * @param {*} k The key of the element to return from the ValueMap object.
   * @returns {*} Returns the element associated with the specified key or undefined if the key can't be found in the ValueMap object.
   */
  get(k) {
    let h = this.getHash(k);
    let b = this.hash[h];
    if (b === undefined)
      return undefined;
    let n = b.find(n => this.isEqual(n.key, k))
    if (n === undefined)
      return undefined;
    return n.value;
  }

  /**
   * The delete() method removes the specified element from a ValueMap object if a corresponding key exists.
   * @param {*} k The key of the element to remove from the ValueMap object.
   * @returns {boolean} Returns true if an element with the specified key existed in the ValueMap object and was removed; otherwise false.
   */
  delete(k) {
    let h = this.getHash(k);
    let b = this.hash[h];
    if (b === undefined)
      return false;
    let ni = b.findIndex(n => this.isEqual(n.key, k))
    if (ni < 0)
      return false;
    b.splice(ni, 1);
    --this.size_;
    if (b.length === 0)
      delete this.hash[h];
    return true;
  }

  /**
   * The values() method returns a new Iterator object that contains the values for each element in the ValueMap object.
   * Note that the values are not returned in insertion order.
   * @returns {Iterator} A new ValueMap iterator object.
   */
  *values() {
    for (let h in this.hash) {
      for (let n of this.hash[h])
        yield n.value;
    }
  }

  /**
   * The keys() method returns a new Iterator object that contains the keys for each element in the ValueMap object.
   * Note that the keys are not returned in insertion order.
   * @returns {Iterator} A new ValueMap iterator object.
   */
  *keys() {
    for (let h in this.hash) {
      for (let n of this.hash[h])
        yield n.key;
    }
  }

  /**
   * The entries() method returns a new Iterator object that contains the [key, value] pairs for each element in the ValueMap object.
   * Note that the elements are not returned in insertion order.
   * @returns {Iterator} A new ValueMap iterator object.
   */
  *entries() {
    for (let h in this.hash) {
      for (let n of this.hash[h])
        yield [n.key, n.value];
    }
  }

  /**
   * The forEach() method invokes a function with three parameters: value, key, and the valueMap itself.
   * Note that the elements are not itterated in insertion order.
   * @returns {Iterator} A new ValueMap iterator object.
   */
  forEach(func) {
    for (let h in this.hash) {
      for (let n of this.hash[h])
        func(n.value, n.key, this);
    }
  }

  /**
   * The clear() method removes all elements from a ValueMap object.
   */
  clear() {
    this.hash = Object.create(null);
    this.size_ = 0;
  }

  toJSON() {
    return JSON.stringify([...this]);
  }
}

ValueMap.prototype.getHash = hash;
ValueMap.prototype.isEqual = isEqual;

if (Symbol && Symbol.iterator)
  ValueMap.prototype[Symbol.iterator] = ValueMap.prototype.entries;

export { ValueMap };
