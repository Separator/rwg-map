"use strict";

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

const generate = (blendingType = types.TYPE_00_00) =>
    Buffer.from([blendingType, 0x00]);

module.exports = {
    types,
    generate
};
