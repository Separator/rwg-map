"use strict";

const BYTES_PER_BLENDING = 2;

// TYPE_[top left][top right]_[bot left][bot right]
const types = {
    TYPE_00_00: 0,   // 0000
    TYPE_11_11: 0,   // 0000
    TYPE_00_11: 1,   // 0001
    TYPE_00_10: 2,   // 0010
    TYPE_10_10: 3,   // 0011
    TYPE_10_00: 4,   // 0100
    TYPE_11_00: 5,   // 0101
    TYPE_01_00: 6,   // 0110
    TYPE_01_01: 7,   // 0111
    TYPE_00_01: 8,   // 1000
    TYPE_11_10: 9,   // 1001
    TYPE_11_01: 10,  // 1010
    TYPE_01_11: 11,  // 1011
    TYPE_10_11: 12   // 1100
};

const mutationKeys = {
    [0x0]: types.TYPE_00_00,
    [0xf]: types.TYPE_11_11,
    [0x3]: types.TYPE_00_11,
    [0x2]: types.TYPE_00_10,
    [0xa]: types.TYPE_10_10,
    [0x8]: types.TYPE_10_00,
    [0xc]: types.TYPE_11_00,
    [0x4]: types.TYPE_01_00,
    [0x5]: types.TYPE_01_01,
    [0x1]: types.TYPE_00_01,
    [0xe]: types.TYPE_11_10,
    [0xd]: types.TYPE_11_01,
    [0x7]: types.TYPE_01_11,
    [0xb]: types.TYPE_10_11
};

const positions = {
    TOP_LEFT: 0x8,
    TOP_RIGHT: 0x4,
    BOTTOM_LEFT: 0x2,
    BOTTOM_RIGHT: 0x1
};

const generate = (blendingType = types.TYPE_00_00) =>
    Buffer.from([blendingType, 0x00]);

const add = (blendingRecord=generate(), additionalBlending=types.TYPE_00_00) =>
    generate(mutationKeys[blendingRecord[0] | additionalBlending]);

const subtract = (blendingRecord=generate(), additionalBlending=types.TYPE_00_00) =>
    generate(mutationKeys[blendingRecord[0] & additionalBlending]);

const setTopLeft = blendingRecord =>
    add(blendingRecord, positions.TOP_LEFT);
const setTopRight = blendingRecord =>
    add(blendingRecord, positions.TOP_RIGHT);
const setBottomLeft = blendingRecord =>
    add(blendingRecord, positions.BOTTOM_LEFT);
const setBottomRight = blendingRecord =>
    add(blendingRecord, positions.BOTTOM_RIGHT);

const clearTopLeft = blendingRecord =>
    subtract(blendingRecord, positions.TOP_LEFT);
const clearTopRight = blendingRecord =>
    subtract(blendingRecord, positions.TOP_RIGHT);
const clearBottomLeft = blendingRecord =>
    subtract(blendingRecord, positions.BOTTOM_LEFT);
const clearBottomRight = blendingRecord =>
    subtract(blendingRecord, positions.BOTTOM_RIGHT);

module.exports = {
    BYTES_PER_BLENDING,
    types,
    positions,
    generate,
    add,
    subtract,
    setTopLeft,
    setTopRight,
    setBottomLeft,
    setBottomRight,
    clearTopLeft,
    clearTopRight,
    clearBottomLeft,
    clearBottomRight
};
