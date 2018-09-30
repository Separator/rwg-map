"use strict";

const EAST = 0;
const SOUTH = 1;
const WEST = 2;
const NORTH = 3;
const BYTES_PER_DIRECTION = 4;

const generate =(direction=EAST, size=BYTES_PER_DIRECTION) => {
    const buf = Buffer.alloc(size);
    buf[0] = direction;
    return buf;
};

module.exports = {
    EAST,
    SOUTH,
    WEST,
    NORTH,
    generate
};
