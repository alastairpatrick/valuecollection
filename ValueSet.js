"use strict";

const isEqual = require("lodash/isEqual");

const { hash } = require("./hash");

const has = Object.prototype.hasOwnProperty;

/**
 * The ValueSet object lets you store unique values of any type, whether primitive values or object references.
 * By default, elements are considered equal using lodash's isEqual, which is deep equality.
 */
class ValueSet {
  /**
   * Create a new ValueSet.
   * @param {Iterable} [iterable] If an iterable object is passed, all of its elements will be added to the new ValueSet. If you don't specify this parameter, or its value is null, the new ValueSet is empty.
   */
  constructor(iterable) {
    this.clear();
    if (iterable) {
      for (let k of iterable)
        this.add(k);
    }
  }

  /**
   * Returns the number of elements in a ValueSet object.
   * @returns {number} The number of elements.
   */
  get size() {
    return this.size_;
  }

  /**
   * Adds a new element with a specified value to the ValueSet object.
   * @param {*} k The value of the element to add to the ValueSet object.
   * @returns {boolean} Returns true if an element was added to the ValueSet object or false if an element with the same key already existed.
   */
  add(k) {
    let h = this.getHash(k);
    let b = this.hash[h];
    if (b === undefined)
      b = this.hash[h] = [];
    let ni = b.findIndex(n => this.isEqual(n, k))
    if (ni >= 0)
      return false;
    b.push(k);
    ++this.size_;
    return true;
  }

  /**
   * Returns a boolean indicating whether an element with the specified value exists in a ValueSet object or not.
   * @param {*} k The value to test for presence in the ValueSet object.
   * @returns {boolean} Returns true if an element with the specified value exists in the ValueSet object, otherwise false.
   */
  has(k) {
    let h = this.getHash(k);
    let b = this.hash[h];
    if (b === undefined)
      return false;
    let ni = b.findIndex(n => this.isEqual(n, k))
    return ni >= 0;
  }

  /**
   * Returns a specified element from a ValueSet object.
   * @param {*} k The value of the element to return from the ValueSet object.
   * @returns {*} Returns the corresponding element or undefined if the element can't be found in the ValueSet object.
   */
  get(k) {
    let h = this.getHash(k);
    let b = this.hash[h];
    if (b === undefined)
      return undefined;
    let ni = b.findIndex(n => this.isEqual(n, k))
    if (ni < 0)
      return undefined;
    return b[ni];
  }

  /**
   * Removes the specified element from a ValueSet object.
   * @param {*} k The value of the element to remove from the ValueSet object.
   * @returns {boolean} Returns true if an element in the ValueSet object has been removed successfully; otherwise false.
   */
  delete(k) {
    let h = this.getHash(k);
    let b = this.hash[h];
    if (b === undefined)
      return false;
    let ni = b.findIndex(n => this.isEqual(n, k))
    if (ni < 0)
      return false;
    b.splice(ni, 1);
    --this.size_;
    if (b.length === 0)
      delete this.hash[h];
    return true;
  }

  /**
   * The values() method returns a new Iterator object that contains the values for each element in the ValueSet object.
   * Note that the values are not returned in insertion order.
   * @returns {Iterator} A new Iterator object containing the values for each element in the given ValueSet.
   */
  *values() {
    for (let h in this.hash) {
      for (let n of this.hash[h])
        yield n;
    }
  }

  /**
   * The entries() method returns a new Iterator object that contains an array of [value, value] for each element in the ValueSet object.
   * Note that the values are not returned in insertion order.
   * @returns {Iterator} A new Iterator object that contains an array of [value, value] for each element in the given ValueSet.
   */
  *entries() {
    for (let h in this.hash) {
      for (let n of this.hash[h])
        yield [n, n];
    }
  }

  /**
   * The clear() method removes all elements from a ValueSet object.
   */
  clear() {
    this.hash = Object.create(null);
    this.size_ = 0;
  }
}

ValueSet.prototype.getHash = hash;
ValueSet.prototype.isEqual = isEqual;

if (Symbol && Symbol.iterator)
  ValueSet.prototype[Symbol.iterator] = ValueSet.prototype.values;
  
module.exports = {
  ValueSet,
}
