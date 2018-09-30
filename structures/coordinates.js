"use strict";

const BYTES_PER_SMALL_COORDINATE = 2;
const BYTES_PER_BIG_COORDINATE = 4;
const VALUES_IN_BYTE = 256;

const generate =(coordinate=0, size=BYTES_PER_BIG_COORDINATE) => {
    const buf = Buffer.alloc(size);
    for (let i = 0; i < size; i++) {
        buf[i] = coordinate % VALUES_IN_BYTE;
        coordinate = Math.floor(coordinate / VALUES_IN_BYTE);
        if (!coordinate) {
            break;
        }
    }
    return buf;
};

module.exports = {
    SMALL: BYTES_PER_SMALL_COORDINATE,
    BIG: BYTES_PER_BIG_COORDINATE,
    generate
};
