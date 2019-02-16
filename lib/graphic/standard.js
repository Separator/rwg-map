'use strict';

const digit = require('../structures/digit');

const BYTES_PER_OFFSET = digit.BYTES_PER_SMALL_DIGIT;
const BYTES_PER_WIDTH = digit.BYTES_PER_SMALL_DIGIT;
const BYTES_PER_HEIGHT = digit.BYTES_PER_SMALL_DIGIT;
const BYTES_PER_RLE = digit.BYTES_PER_TINY_DIGIT;
const BYTES_PER_LINE_LENGTH = digit.BYTES_PER_SMALL_DIGIT;
const BYTES_PER_PIXEL = digit.BYTES_PER_TINY_DIGIT;

const OFFSET_X = 0;
const OFFSET_Y = OFFSET_X + BYTES_PER_OFFSET;
const OFFSET_WIDTH = OFFSET_Y + BYTES_PER_OFFSET;
const OFFSET_HEIGHT = OFFSET_WIDTH + BYTES_PER_WIDTH;
const OFFSET_RLE = OFFSET_HEIGHT + BYTES_PER_HEIGHT;
const OFFSET_DATA = OFFSET_RLE + BYTES_PER_RLE;

const getOffsetX = tile =>
    digit.toInt(tile.slice(OFFSET_X, OFFSET_X + BYTES_PER_OFFSET));

const getOffsetY = tile =>
    digit.toInt(tile.slice(OFFSET_Y, OFFSET_Y + BYTES_PER_OFFSET));

const getWidth = tile =>
    digit.toInt(tile.slice(OFFSET_WIDTH, OFFSET_WIDTH + BYTES_PER_WIDTH));

const getHeight = tile =>
    digit.toInt(tile.slice(OFFSET_HEIGHT, OFFSET_HEIGHT + BYTES_PER_HEIGHT));

const getRLE = tile =>
    digit.toInt(tile.slice(OFFSET_RLE, OFFSET_RLE + BYTES_PER_RLE));

const decompressTile = tile => {
    let result = {
        offsetX: getOffsetX(tile),
        offsetY: getOffsetY(tile),
        width: getWidth(tile),
        height: getHeight(tile),
        rle: getRLE(tile),
        data: []
    };
    let offset = OFFSET_DATA;
    for (let lineIndex = 0; lineIndex < result.height; lineIndex++) {
        let bytesInLine = digit.toInt(tile.slice(offset, offset + BYTES_PER_LINE_LENGTH));
        offset += BYTES_PER_LINE_LENGTH;
        let endOfLine = offset + bytesInLine;
        let line = [];
        while (offset < endOfLine) {
            let repeats = digit.toInt(tile.slice(offset, offset + BYTES_PER_PIXEL));
            offset += BYTES_PER_PIXEL;
            if (repeats >= 0x80) {
                let pixel = digit.toInt(tile.slice(offset, offset + BYTES_PER_PIXEL));
                offset += BYTES_PER_PIXEL;
                for (let j = 0; j < repeats - 0x80; j++) {
                    line.push(pixel);
                }
            } else {
                for (let j = 0; j < repeats; j++) {
                    let pixel = digit.toInt(tile.slice(offset, offset + BYTES_PER_PIXEL));
                    line.push(pixel);
                    offset += BYTES_PER_PIXEL;
                }
            }
        }
        result.data[lineIndex] = line;
    }
    return result;
};

module.exports = {
    decompressTile
};
