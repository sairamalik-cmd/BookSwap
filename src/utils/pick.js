'use strict';

/**
 * Pick allowed keys from an object (used for query filtering).
 */
const pick = (obj, keys) =>
  keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});

module.exports = pick;
