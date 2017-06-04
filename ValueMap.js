"use strict";

const isEqual = require("lodash/isEqual");

const { hash } = require("./hash");

const has = Object.prototype.hasOwnProperty;

// Similar interface to JavaScript Map. Key equality is based on lodash isEqual by default.
class ValueMap {
  constructor() {
    this.clear();
  }

  get size() {
    return this.size_;
  }

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

  has(k) {
    let h = this.getHash(k);
    let b = this.hash[h];
    if (b === undefined)
      return false;
    let ni = b.findIndex(n => this.isEqual(n.key, k))
    return ni >= 0;
  }

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

  *values() {
    for (let h in this.hash) {
      for (let n of this.hash[h])
        yield n.value;
    }
  }

  *keys() {
    for (let h in this.hash) {
      for (let n of this.hash[h])
        yield n.key;
    }
  }

  *entries() {
    for (let h in this.hash) {
      for (let n of this.hash[h])
        yield [n.key, n.value];
    }
  }

  clear() {
    this.hash = Object.create(null);
    this.size_ = 0;
  }
}

ValueMap.prototype.getHash = hash;
ValueMap.prototype.isEqual = isEqual;

module.exports = {
  ValueMap,
}
