"use strict";

const digit = require('./digit');
const BYTES_PER_TERRAIN = digit.BYTES_PER_TINY_DIGIT;

const terrain = {
    GRASS: 0x00,
    ARABLE: 0x02,
    ASPHALT: 0x03,
    SOIL: 0x04,
    DRY_SOIL: 0x05,
    WATER: 0x06,
    SAND: 0x07
};

const generate = (terrainType = terrain.GRASS) =>
    digit.generate(terrainType, BYTES_PER_TERRAIN);

module.exports = {
    BYTES_PER_TERRAIN,
    ...terrain,
    generate
};
