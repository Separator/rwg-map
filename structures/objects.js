"use strict";

const digit = require('./digit');
const coordinates = require('./coordinates');
const BYTES_PER_TYPE = digit.BYTES_PER_TINY_DIGIT;
const BYTES_PER_DAMAGED = digit.BYTES_PER_TINY_DIGIT;
const BYTES_PER_INDEX = digit.BYTES_PER_SMALL_DIGIT;

const CELL_WIDTH = 32;
const CELL_HEIGHT = 32;
const OFFSET = 8;
const STEP = 16;
const SIZE_DEFAULT = 179;

const damage = {
    NONE: 0,
    DAMAGED_BY_33: 1,
    DAMAGED_BY_66: 2,
    DAMAGED_BY_100: 3
};

const types = {
    bred: null,
    fre: {
        id: null,
        desc: "free objects",
        damage: [],
        size: SIZE_DEFAULT
    },
    lay: {

    },
    stand: {

    },
    tree: {

    },
    trop: {

    },
    dom: {

    },
    zabor: {

    },
    cliff: {

    },
    vor: {

    },
    most: {

    }
};

const generate = (offsetX, offsetY, type, damaged=damage.NONE, index) =>
    Buffer.concat([
        coordinates.generate(offsetX),
        coordinates.generate(offsetY),
        digit.generate(type, BYTES_PER_TYPE),
        digit.generate(damaged, BYTES_PER_DAMAGED),
        digit.generate(index, BYTES_PER_INDEX)
    ]);

module.exports = {
    generate
};
