"use strict";

const BYTES_PER_TINY_DIGIT = 1;
const BYTES_PER_SMALL_DIGIT = 2;
const BYTES_PER_BIG_DIGIT = 4;
const VALUES_IN_BYTE = 256;

const generate =(digit=0, size=BYTES_PER_SMALL_DIGIT) => {
    const buf = Buffer.alloc(size);
    for (let i = 0; i < size; i++) {
        buf[i] = digit % VALUES_IN_BYTE;
        digit = Math.floor(digit / VALUES_IN_BYTE);
        if (!digit) {
            break;
        }
    }
    return buf;
};

const toInt = rec => {
    let result = 0;
    for (let i = 0; i < rec.length; i++) {
        result += i ? rec[i] * i * VALUES_IN_BYTE : rec[i];
    }
    return result;
};

module.exports = {
    BYTES_PER_TINY_DIGIT,
    BYTES_PER_SMALL_DIGIT,
    BYTES_PER_BIG_DIGIT,
    generate,
    toInt
};
