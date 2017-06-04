"use strict";

const { expect } = require("chai");

const { ValueSet } = require("..");

describe("ValueSet", function() {
  let set1;

  beforeEach(function() {
    set1 = new ValueSet();
  })

  it("size is zero to start", function() {
    expect(set1.size).to.equal(0);
  })

  it("size is zero for set constructed with undefined iterable", function() {
    expect(new ValueSet(undefined).size).to.equal(0);
  })

  it("size is zero for set constructed with null iterable", function() {
    expect(new ValueSet(null).size).to.equal(0);
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

  // Not in insertion order.
  it("can iterate entries", function() {
    set1.add(1);
    set1.add("2");
    set1.add({ foo: false });
    let found = [];
    for (let k of set1)
      found.push(k);
    expect(found.sort()).to.deep.equal([1, "2", { foo: false }]);
  })

  it("can construct from iterable of elements to add", function() {
    let set = new ValueSet([1, 1, 2]);
    expect(set.size).to.equal(2);
    expect(set.has(1)).to.be.true;
    expect(set.has(2)).to.be.true;
    expect(set.has(3)).to.be.false;
  })
})
