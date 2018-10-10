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
const MAGIC_NUMBER = 179;

const damage = {
    NONE: 0,
    STEP_1: 1,
    STEP_2: 2,
    STEP_3: 3,
    UNDEFINED: MAGIC_NUMBER
};

const types = {
    bred: null,
    fre: {
        id: null,
        desc: "free objects",
        damage: [damage.UNDEFINED],
        size: MAGIC_NUMBER
    },
    lay: {
        id: null,
        desc: "horizontal objects",
        damage: [damage.NONE, damage.STEP_1],
        size: MAGIC_NUMBER
    },
    stand: {
        id: null,
        desc: "vertical objects",
        damage: [damage.NONE, damage.STEP_1],
        size: MAGIC_NUMBER
    },
    tree: {
        id: null,
        desc: "trees objects",
        damage: [damage.NONE, damage.STEP_1],
        size: MAGIC_NUMBER
    },
    trop: {
        id: null,
        desc: "roads objects",
        damage: [damage.UNDEFINED],
        size: MAGIC_NUMBER
    },
    dom: {
        id: null,
        desc: "buildings objects",
        damage: [damage.NONE, damage.STEP_1, damage.STEP_2, damage.STEP_3],
        size: MAGIC_NUMBER
    },
    zabor: {
        id: null,
        desc: "buildings objects",
        damage: [damage.NONE],
        size: []
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
