"use strict";

const sizes = require('./structures/sizes');
const schemes = require('./structures/schemes');

const BYTES_IN_SECTION = 4;
const sections = {
    EMPTY: 0,
    SCHEME: 1,
    SIZE_X: 2,
    SIZE_Y: 3
};

const generateSection = (digit=0) =>
    Buffer.from([digit % 256, Math.floor(digit / 256), 0x00, 0x00]);

const generate = (scheme=schemes.SUMMER, size=sizes.SMALL) =>
    Buffer.concat([
        generateSection(),
        generateSection(scheme),
        generateSection(size),
        generateSection(size)
    ], BYTES_IN_SECTION * Object.keys(sections).length);

module.exports = {
    generate
};