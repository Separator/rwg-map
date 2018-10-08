"use strict";

const digit = require('./digit');
const BYTES_PER_SMALL_COORDINATE = digit.BYTES_PER_SMALL_DIGIT;
const BYTES_PER_BIG_COORDINATE = digit.BYTES_PER_BIG_DIGIT;

const generate =(coordinate=0, size=BYTES_PER_BIG_COORDINATE) =>
    digit.generate(coordinate, size);

module.exports = {
    BYTES_PER_SMALL_COORDINATE,
    BYTES_PER_BIG_COORDINATE,
    generate
};
