"use strict";

const terrain = {
    GRASS: 0x00,
    ARABLE: 0x02,
    ASPHALT: 0x03,
    SOIL: 0x04,
    DRY_SOIL: 0x05,
    WATER: 0x06,
    SAND: 0x07
};

const generate = (terrain = terrain.GRASS) =>
    Buffer.from([terrain]);

module.exports = {
    ...terrain,
    generate
};
