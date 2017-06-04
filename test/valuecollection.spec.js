"use strict";

const { expect } = require("chai");

const { ValueMap, ValueSet } = require("..");

describe("ValueMap", function() {
  let map1;

  beforeEach(function() {
    map1 = new ValueMap();
  })

  it("size is zero to start", function() {
    expect(map1.size).to.equal(0);
  })

  it("size is one after setting value", function() {
    expect(map1.set("hello", "there")).to.equal(map1);
    expect(map1.size).to.equal(1);
  })

  it("can retrieve value", function() {
    map1.set("hello", "there");
    expect(map1.get("hello")).to.equal("there");
  })

  it("can check for presence value", function() {
    expect(map1.has("hello")).to.be.false;
    map1.set("hello", "there");
    expect(map1.has("hello")).to.be.true;
  })

  it("setting replaces value", function() {
    map1.set("hello", "there");
    map1.set("hello", "again");
    expect(map1.get("hello")).to.equal("again");
    expect(map1.size).to.equal(1);
  })

  it("can use null as key", function() {
    expect(map1.get(null)).to.equal(undefined);
    expect(map1.has(null)).to.be.false;    
    map1.set(null, "there");
    expect(map1.get(null)).to.equal("there");
    expect(map1.has(null)).to.be.true;
  })

  it("can use undefined as key", function() {
    expect(map1.get(undefined)).to.equal(undefined);
    expect(map1.has(undefined)).to.be.false;    
    map1.set(undefined, "there");
    expect(map1.get(undefined)).to.equal("there");
    expect(map1.has(undefined)).to.be.true;
  })

  it("can use NaN as key", function() {
    expect(map1.get(NaN)).to.equal(undefined);
    expect(map1.has(NaN)).to.be.false;    
    map1.set(NaN, "there");
    expect(map1.get(NaN)).to.equal("there");
    expect(map1.has(NaN)).to.be.true;
  })

  it("can use object as key", function() {
    expect(map1.get({ greeting: "hello" })).to.equal(undefined);
    expect(map1.has({ greeting: "hello" })).to.be.false;
    map1.set({ greeting: "hello" }, "there");
    expect(map1.get({ greeting: "hello" })).to.equal("there");
    expect(map1.get({ greeting: "howdy" })).to.be.undefined;
    expect(map1.get({ salutation: "hello" })).to.be.undefined;
    expect(map1.has({ greeting: "hello" })).to.be.true;
  })

  it("object property insertion order does not affect equlity of keys", function() {
    let k1 = {};
    k1.a = 1;
    k1.b = 2;

    let k2 = {};
    k2.b = 2;
    k2.a = 1;

    map1.set(k1, "hello");
    expect(map1.get(k1)).to.equal("hello");
    expect(map1.get(k2)).to.equal("hello");
    map1.set(k2, "hello");
    expect(map1.size).to.equal(1);
    expect(map1.get(k1)).to.equal("hello");
    expect(map1.get(k2)).to.equal("hello");
  })

  it("can use undefined as value", function() {
    expect(map1.get(undefined)).to.equal(undefined);
    expect(map1.has(undefined)).to.be.false;    
    expect(map1.has(undefined)).to.be.false;
    map1.set(undefined, undefined);
    expect(map1.get(undefined)).to.equal(undefined);
    expect(map1.has(undefined)).to.be.true;
    expect(map1.has(undefined)).to.be.true;
  })

  it("can delete value", function() {
    map1.set("hello", "there");
    expect(map1.delete("hello")).to.be.true;
    expect(map1.get("hello")).to.be.undefined;
    expect(map1.size).to.equal(0);
  })

  it("deleting non-existent value returns false", function() {
    map1.set("hello", "there");
    expect(map1.delete("not there")).to.be.false;
    expect(map1.size).to.equal(1);
  })

  it("can clear all values", function() {
    map1.set("hello", "there");
    map1.clear();
    expect(map1.size).to.equal(0);
  })

  // Not in insertion order.
  it("can get all values", function() {
    map1.set(1, "a");
    map1.set("2", "b");
    map1.set({ foo: false }, "c");
    expect(Array.from(map1.values()).sort()).to.deep.equal(["a", "b", "c"]);
  })

  // Not in insertion order.
  it("can get all keys", function() {
    map1.set(1, "a");
    map1.set("2", "b");
    map1.set({ foo: false }, "c");
    expect(Array.from(map1.keys()).sort()).to.deep.equal([1, "2", { foo: false }]);
  })

  // Not in insertion order.
  it("can get all entries", function() {
    map1.set(1, "a");
    map1.set("2", "b");
    map1.set({ foo: false }, "c");
    expect(Array.from(map1.entries()).sort()).to.deep.equal([
      [1, "a"],
      ["2", "b"],
      [{ foo: false }, "c"],
    ]);
  })
})

describe("ValueSet", function() {
  let set1;

  beforeEach(function() {
    set1 = new ValueSet();
  })

  it("size is zero to start", function() {
    expect(set1.size).to.equal(0);
  })

  it("size is one after adding value", function() {
    expect(set1.add("hello")).to.be.true;
    expect(set1.size).to.equal(1);
  })

  it("can determine presence", function() {
    set1.add("hello");
    expect(set1.has("hello")).to.be.true;
    expect(set1.has("there")).to.be.false;
  })

  it("adding second time returns false", function() {
    expect(set1.add("hello")).to.be.true;
    expect(set1.add("hello")).to.be.false;
    expect(set1.has("hello")).to.be.true;
    expect(set1.size).to.equal(1);
  })

  it("can use null as key", function() {
    expect(set1.has(null)).to.false;
    set1.add(null);
    expect(set1.has(null)).to.true;
  })

  it("can use undefined as key", function() {
    expect(set1.has(undefined)).to.false;
    set1.add(undefined);
    expect(set1.has(undefined)).to.true;
  })

  it("can use NaN as key", function() {
    expect(set1.has(NaN)).to.be.false;
    set1.add(NaN, "there");
    expect(set1.has(NaN)).to.be.true;
  })

  it("can use object as key", function() {
    expect(set1.has({ greeting: "hello" })).to.be.false;
    set1.add({ greeting: "hello" });
    expect(set1.has({ greeting: "hello" })).to.be.true;
    expect(set1.has({ greeting: "howdy" })).to.be.false;
    expect(set1.has({ salutation: "hello" })).to.be.false;
  })

  it("can get key and it is identical to originally added key", function() {
    let key = { a: 1 };
    set1.add(key);
    expect(set1.get({ a: 1 })).to.equal(key);
  })

  it("getting key not in set yields undefined", function() {
    set1.add({ a: 1 });
    expect(set1.get({ b: 2 })).to.be.undefined;
  })

  it("can delete value", function() {
    set1.add("hello");
    expect(set1.delete("hello")).to.be.true;
    expect(set1.has("hello")).to.be.false;
    expect(set1.size).to.equal(0);
  })

  it("deleting non-existent value returns false", function() {
    set1.add("hello");
    expect(set1.delete("not there")).to.be.false;
    expect(set1.size).to.equal(1);
  })

  it("can clear all values", function() {
    set1.add("hello");
    set1.clear();
    expect(set1.has("hello")).to.be.false;
    expect(set1.size).to.equal(0);
  })

  // Not in insertion order.
  it("can get all values", function() {
    set1.add(null);
    set1.add(undefined);
    set1.add(1);
    set1.add("2");
    set1.add({ foo: false });
    expect(Array.from(set1.values()).sort()).to.deep.equal([1, "2", { foo: false }, null, undefined]);
  })

  // Not in insertion order.
  it("can get all entries", function() {
    set1.add(1);
    set1.add("2");
    set1.add({ foo: false });
    expect(Array.from(set1.entries()).sort()).to.deep.equal([
      [1, 1],
      ["2", "2"],
      [{ foo: false }, { foo: false }],
    ]);
  })
})
