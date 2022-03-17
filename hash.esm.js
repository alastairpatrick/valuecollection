"use strict";

const has = Object.prototype.hasOwnProperty;

const SEED = 5381;

/**
 * Returns the numeric hash value for a string. Must return the same hash value for equal strings.
 * @param {number} h The seed hash value.
 * @param {string} k The string to be hashes.
 * @returns {number} The computed hash value.
 */
const hashString = (h, v) => {
  v = String(v)
  // Throughout this file, using (x | 0) to bitwise truncate x to a signed 32-bit integer.
  for (let i = 0; i < v.length; ++i)
    h = (((h * 33) | 0) + v.charCodeAt(i)) | 0;
  return h;
}

/**
 * Returns a numeric hash value. Must return the same hash value for equal inputs. For objects,
 * aside from looking at the name of the constructor function, only looks at property values one
 * level deep, making it suitable for use with either shallow and deep equality.
 * @param {*} k The value to be hashed.
 * @returns {number} The computed hash value.
 */
const hash = (k) => {
  if (k && typeof k === "object") {
    let h = 0;
    if (typeof k.constructor === "object")
      h = hashString(SEED, k.constructor.name);

    // Property name and value are hashed as a pair. The hash values of all property name/value pairs are summed.
    // Summming the hash values does not make a particularly good hash function but has the advantage that
    // integer addition is commutative, which means it does not matter in which order the properties are enumerated.
    // This is also the reason for bitwise ORing the has values with zero. It keeps them in the 32-bit signed
    // integer range. If they were to stray into the range where they are floating point proper, addition would no
    // longer be commutative because of rounding error.
    for (let n in k) {
      if (has.call(k, n))
        h = (h + hashString(hashString(SEED, n), k[n])) | 0;
    }
    return h;
  } else {
    return hashString(SEED, k);
  }
}


export { hashString, hash };
