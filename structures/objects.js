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
const FENCE_INDEX = 8;
const DAMAGED_FENCE_INDEX = 9;

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
        desc: "free objects",
        damage: [damage.UNDEFINED],
        index: [MAGIC_NUMBER],
        amount: [
            [0, 296],
            [299, 303],
            [349, 369],
            [373, 376],
            [392, 407],
            [499, 507],
            [519, 524]
        ]
    },
    lay: {
        desc: "horizontal objects",
        damage: [damage.NONE, damage.STEP_1],
        index: [MAGIC_NUMBER],
        amount: [
            7, 11,
            [85, 88]
        ]
    },
    stand: {
        desc: "vertical objects",
        damage: [damage.NONE, damage.STEP_1],
        index: [MAGIC_NUMBER],
        amount: [
            [0, 117],
            [119, 1019]
        ]
    },
    tree: {
        desc: "trees objects",
        damage: [damage.NONE, damage.STEP_1],
        index: [MAGIC_NUMBER],
        amount: [
            [0, 127]
        ]
    },
    trop: {
        desc: "roads objects",
        damage: [damage.UNDEFINED],
        index: [MAGIC_NUMBER],
        amount: [
            [0, 75],
            [80, 127],
            [129, 139],
            [141, 173],
            [176, 198],
            [200, 236],
            [240, 255]
        ]
    },
    dom: {
        desc: "buildings objects",
        damage: [damage.NONE, damage.STEP_1, damage.STEP_2, damage.STEP_3],
        index: [MAGIC_NUMBER],
        amount: [
            [0, 63],
            [66, 67],
            [70, 362],
            [371, 421],
            434, 442,
            [444, 451],
            [456, 490],
            499, 504, 506,
            [508, 892],
            [897, 917],
            [920, 976],
            [985, 1019]
        ]
    },
    zabor: {
        desc: "fences objects",
        damage: [damage.NONE, damage.STEP_1, damage.STEP_2],
        index: [FENCE_INDEX, DAMAGED_FENCE_INDEX],
        amount: [
            [24, 31], [32, 39],
            [64, 66], [72, 74],
            [104, 105], [112, 113]
        ]
    },
    cliff: {
        desc: "cliff objects",
        damage: [damage.UNDEFINED],
        index: [MAGIC_NUMBER],
        amount: [
            [0, 54],
            [56, 65],
            [72, 126]
        ]
    },
    vor: {
        desc: "crates objects",
        damage: [damage.UNDEFINED],
        index: [MAGIC_NUMBER],
        amount: [
            [0, 2], [8, 10], [16, 18], [24, 25],
            [32, 33], [40, 41], [48, 49], 56,
            [64, 65], [72, 74], 80,
            [88, 89], [96, 98], [104, 106],
            [112, 114], [119, 120]
        ]
    },
    most: {
        desc: "bridges objects",
        damage: [damage.NONE, damage.STEP_1, damage.STEP_2, damage.STEP_3],
        index: [MAGIC_NUMBER],
        amount: [
            [0, 22],
            [24, 31],
            [34, 37],
            [40, 53],
            [55, 63]
        ]
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
