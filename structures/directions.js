"use strict";

const digit = require('./digit');
const EAST = 0;
const SOUTH = 1;
const WEST = 2;
const NORTH = 3;
const BYTES_PER_DIRECTION = digit.BYTES_PER_BIG_DIGIT;

const generate =(direction=EAST, size=BYTES_PER_DIRECTION) =>
    digit.generate(direction, size);

module.exports = {
    EAST,
    SOUTH,
    WEST,
    NORTH,
    generate
};
