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

const names = {
    FREE: 'fre',
    HORIZONTAL: 'lay',
    VERTICAL: 'stand',
    TREES: 'tree',
    ROADS: 'trop',
    BUILDINGS: 'dom',
    FENCES: 'zabor',
    CLIFF: 'cliff',
    CRATES: 'vor',
    BRIDGES: 'most'
};

const props = {
    TYPE: 0,
    OFFSET_X: 1,
    OFFSET_Y: 2,
    ID: 3,
    DAMAGE: 4,
    INDEX: 5
};

const generateIndexes = chunk =>
    [...new Array(chunk[1] - chunk[0] + 1)].map((value, index) => chunk[0] + index);

const concatIndexes = indexes =>
    indexes.reduce((rs, chunk) =>
        (chunk.constructor === Array) ?
            rs.concat(generateIndexes(chunk)) :
            rs.concat([chunk])
        , []);

const types = {
    //bred: null,
    [names.FREE]: {
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
    [names.HORIZONTAL]: {
        damage: [damage.NONE, damage.STEP_1],
        index: [MAGIC_NUMBER],
        indexes: concatIndexes([
            7, 11,
            [85, 88]
        ]),
        offset: offset.EIGHT,
        step: step.SIXTEEN
    },
    [names.VERTICAL]: {
        damage: [damage.NONE, damage.STEP_1],
        index: [MAGIC_NUMBER],
        indexes: concatIndexes([
            [0, 117],
            [119, 1019]
        ]),
        offset: offset.EIGHT,
        step: step.SIXTEEN
    },
    [names.TREES]: {
        damage: [damage.NONE, damage.STEP_1],
        index: [MAGIC_NUMBER],
        indexes: concatIndexes([
            [0, 127]
        ]),
        offset: offset.EIGHT,
        step: step.SIXTEEN
    },
    [names.ROADS]: {
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
    [names.BUILDINGS]: {
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
    [names.FENCES]: {
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
    [names.CLIFF]: {
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
    [names.CRATES]: {
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
    [names.BRIDGES]: {
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

const fencesInfo = [{
    identifiers: concatIndexes([[24, 31]]),
    damage: damage.NONE,
    modifier: FENCE_INDEX
}, {
    identifiers: concatIndexes([[32, 39]]),
    damage: damage.NONE,
    modifier: DAMAGED_FENCE_INDEX
}, {
    identifiers: concatIndexes([[64, 66]]),
    damage: damage.STEP_1,
    modifier: FENCE_INDEX
}, {
    identifiers: concatIndexes([[72, 74]]),
    damage: damage.STEP_1,
    modifier: DAMAGED_FENCE_INDEX
}, {
    identifiers: concatIndexes([[104, 105]]),
    damage: damage.STEP_2,
    modifier: FENCE_INDEX
}, {
    identifiers: concatIndexes([[112, 113]]),
    damage: damage.STEP_2,
    modifier: DAMAGED_FENCE_INDEX
}];

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

const convertOffset = (objectType, offset) => {
    let typeOffset = types[objectType].offset;
    let typeStep = types[objectType].step;
    if (offset < typeOffset) {
        return typeOffset;
    } else {
        if ((offset - typeOffset) % typeStep) {
            return offset - ((offset - typeOffset) % typeStep);
        } else {
            return offset;
        }
    }
};

const generateFence = (id, offsetX, offsetY) => {
    for (let i = 0; i < fencesInfo.length; i++) {
        let fences = fencesInfo[i];
        if (fences.identifiers.indexOf(id) > -1) {
            return [
                names.FENCES,
                convertOffset(names.FENCES, offsetX),
                convertOffset(names.FENCES, offsetY),
                id,
                fences.damage,
                fences.modifier
            ]
        }
    }
    return false;
};

const generate = (objectType, id, offsetX, offsetY, damage) =>
    isObjectExists(objectType, id)
        ? isDamageExists(objectType, damage)
            ? objectType === names.FENCES
                ? generateFence(id, offsetX, offsetY)
                : [
                    objectType,
                    convertOffset(objectType, offsetX),
                    convertOffset(objectType, offsetY),
                    id,
                    damage,
                    MAGIC_NUMBER
                ]
            : false
        : false;

module.exports = {
    cell,
    offset,
    step,
    damage,
    props,
    names,
    types,
    generateBinary,
    generate
};
