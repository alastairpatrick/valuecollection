"use strict";

const isEqual = require("lodash/isEqual");

const { hash } = require("./hash");

const has = Object.prototype.hasOwnProperty;

// Similar interface to JavaScript Set. Key equality is based on lodash isEqual by default.
class ValueSet {
  constructor() {
    this.clear();
  }

  get size() {
    return this.size_;
  }

  // Does not return ValueSet object.
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

  has(k) {
    let h = this.getHash(k);
    let b = this.hash[h];
    if (b === undefined)
      return false;
    let ni = b.findIndex(n => this.isEqual(n, k))
    return ni >= 0;
  }

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

  *values() {
    for (let h in this.hash) {
      for (let n of this.hash[h])
        yield n;
    }
  }

  *entries() {
    for (let h in this.hash) {
      for (let n of this.hash[h])
        yield [n, n];
    }
  }

  clear() {
    this.hash = Object.create(null);
    this.size_ = 0;
  }
}

ValueSet.prototype.getHash = hash;
ValueSet.prototype.isEqual = isEqual;

module.exports = {
  ValueSet,
}
