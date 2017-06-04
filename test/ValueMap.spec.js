"use strict";

const { expect } = require("chai");

const { ValueMap } = require("..");

describe("ValueMap", function() {
  let map1;

  beforeEach(function() {
    map1 = new ValueMap();
  })

  it("size is zero to start", function() {
    expect(map1.size).to.equal(0);
  })

  it("size is zero for map constructed with undefined iterable", function() {
    expect(new ValueMap(undefined).size).to.equal(0);
  })

  it("size is zero for map constructed with null iterable", function() {
    expect(new ValueMap(null).size).to.equal(0);
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

  // Not in insertion order.
  it("can iterate entries", function() {
    map1.set(1, "a");
    map1.set("2", "b");
    map1.set({ foo: false }, "c");
    let found = [];
    for (let [k, v] of map1)
      found.push([k, v]);
    expect(found.sort()).to.deep.equal([
      [1, "a"],
      ["2", "b"],
      [{ foo: false }, "c"],
    ]);
  })

  it("can construct from iterable of [key, value] pairs", function() {
    let map = new ValueMap([[1, "a"], [1, "b"], [2, "c"]]);
    expect(map.size).to.equal(2);
    expect(map.has(1)).to.be.true;
    expect(map.get(1)).to.be.equal("b");
    expect(map.has(2)).to.be.true;
    expect(map.get(2)).to.be.equal("c");
    expect(map.has(3)).to.be.false;
  })
})
