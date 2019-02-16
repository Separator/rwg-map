'use strict';

const digit = require('../structures/digit');

const BYTES_PER_TILES_NUMBER = digit.BYTES_PER_BIG_DIGIT;
const BYTES_PER_POINTER = digit.BYTES_PER_BIG_DIGIT;

const getTilesNumber = icons =>
    digit.toInt(icons.slice(0, BYTES_PER_TILES_NUMBER));

const getTileOffset = (icons, index) => {
    let offset = BYTES_PER_TILES_NUMBER + index * BYTES_PER_POINTER;
    return digit.toInt(icons.slice(offset, offset + BYTES_PER_POINTER));
};

const getTile = (icons, index) => {
    const offsetBegin = getTileOffset(icons, index);
    const offsetEnd = getTileOffset(icons, index + 1);
    return icons.slice(offsetBegin, offsetEnd);
};

module.exports = {
    getTilesNumber,
    getTileOffset,
    getTile
};
