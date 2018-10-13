"use strict";

const digit = require('./digit');
const coordinates = require('./coordinates');
const BYTES_PER_TYPE = digit.BYTES_PER_TINY_DIGIT;
const BYTES_PER_DAMAGED = digit.BYTES_PER_TINY_DIGIT;
const BYTES_PER_INDEX = digit.BYTES_PER_SMALL_DIGIT;

const MAGIC_NUMBER = 179;
const FENCE_INDEX = 8;
const DAMAGED_FENCE_INDEX = 9;

const cell = {
    WIDTH: 32,
    HEIGHT: 32
};

const offset = {
    ZERO: 0,
    FOUR: 4,
    EIGHT: 8,
    SIXTEEN: 16
};

const step = {
    EIGHT: 8,
    SIXTEEN: 16,
    THIRTY_TWO: 32
};

const damage = {
    NONE: 0,
    STEP_1: 1,
    STEP_2: 2,
    STEP_3: 3,
    UNDEFINED: MAGIC_NUMBER
};

const generateIndexes = chunk =>
    [...new Array(chunk[1] - chunk[0] + 1)].map((value, index) => chunk[0]+ index);

const concatIndexes = indexes =>
    indexes.reduce((rs, chunk) =>
        (chunk.constructor === Array) ?
            rs.concat(generateIndexes(chunk)) :
            rs.concat([chunk])
        , []);

const types = {
    //bred: null,
    fre: {
        desc: "free objects",
        damage: [damage.UNDEFINED],
        index: [MAGIC_NUMBER],
        indexes: concatIndexes([
            [0, 296],
            [299, 303],
            [349, 369],
            [373, 376],
            [392, 407],
            [499, 507],
            [519, 524]
        ]),
        offset: offset.FOUR,
        step: step.EIGHT
    },
    lay: {
        desc: "horizontal objects",
        damage: [damage.NONE, damage.STEP_1],
        index: [MAGIC_NUMBER],
        indexes: concatIndexes([
            7, 11,
            [85, 88]
        ]),
        offset: offset.EIGHT,
        step: step.SIXTEEN
    },
    stand: {
        desc: "vertical objects",
        damage: [damage.NONE, damage.STEP_1],
        index: [MAGIC_NUMBER],
        indexes: concatIndexes([
            [0, 117],
            [119, 1019]
        ]),
        offset: offset.EIGHT,
        step: step.SIXTEEN
    },
    tree: {
        desc: "trees objects",
        damage: [damage.NONE, damage.STEP_1],
        index: [MAGIC_NUMBER],
        indexes: concatIndexes([
            [0, 127]
        ]),
        offset: offset.EIGHT,
        step: step.SIXTEEN
    },
    trop: {
        desc: "roads objects",
        damage: [damage.UNDEFINED],
        index: [MAGIC_NUMBER],
        indexes: concatIndexes([
            [0, 75],
            [80, 127],
            [129, 139],
            [141, 173],
            [176, 198],
            [200, 236],
            [240, 255]
        ]),
        offset: offset.FOUR,
        step: step.EIGHT
    },
    dom: {
        desc: "buildings objects",
        damage: [damage.NONE, damage.STEP_1, damage.STEP_2, damage.STEP_3],
        index: [MAGIC_NUMBER],
        indexes: concatIndexes([
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
        ]),
        offset: offset.ZERO,
        step: step.THIRTY_TWO
    },
    zabor: {
        desc: "fences objects",
        damage: [damage.NONE, damage.STEP_1, damage.STEP_2],
        index: [FENCE_INDEX, DAMAGED_FENCE_INDEX],
        indexes: concatIndexes([
            [24, 31], [32, 39],
            [64, 66], [72, 74],
            [104, 105], [112, 113]
        ]),
        offset: offset.SIXTEEN,
        step: step.THIRTY_TWO
    },
    cliff: {
        desc: "cliff objects",
        damage: [damage.UNDEFINED],
        index: [MAGIC_NUMBER],
        indexes: concatIndexes([
            [0, 54],
            [56, 65],
            [72, 126]
        ]),
        offset: offset.ZERO,
        step: step.SIXTEEN
    },
    vor: {
        desc: "crates objects",
        damage: [damage.UNDEFINED],
        index: [MAGIC_NUMBER],
        indexes: concatIndexes([
            [0, 2], [8, 10], [16, 18], [24, 25],
            [32, 33], [40, 41], [48, 49], 56,
            [64, 65], [72, 74], 80,
            [88, 89], [96, 98], [104, 106],
            [112, 114], [119, 120]
        ]),
        offset: offset.FOUR,
        step: step.EIGHT
    },
    most: {
        desc: "bridges objects",
        damage: [damage.NONE, damage.STEP_1, damage.STEP_2, damage.STEP_3],
        index: [MAGIC_NUMBER],
        indexes: concatIndexes([
            [0, 22],
            [24, 31],
            [34, 37],
            [40, 53],
            [55, 63]
        ]),
        offset: offset.ZERO,
        step: step.THIRTY_TWO
    }
};

const generateBinary = (offsetX, offsetY, type, damaged=damage.NONE, index) =>
    Buffer.concat([
        coordinates.generate(offsetX),
        coordinates.generate(offsetY),
        digit.generate(type, BYTES_PER_TYPE),
        digit.generate(damaged, BYTES_PER_DAMAGED),
        digit.generate(index, BYTES_PER_INDEX)
    ]);

const isObjectExists = (objectType, index) =>
    types[objectType] && types[objectType].indexes.indexOf(index) > -1;

const isDamageExists = (objectType, damage) =>
    types[objectType].damage.indexOf(damage) > -1;

const generate = (objectType, id, offsetX, offsetY, damage, index=MAGIC_NUMBER) =>
    isObjectExists(objectType, id) ?
        isDamageExists(objectType, damage) ?
            [objectType, offsetX, offsetY, id, damage, index] :
            false :
        false;

module.exports = {
    cell,
    offset,
    step,
    damage,
    generateBinary,
    generate
};
