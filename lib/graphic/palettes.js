'use strict';

const colors = require('./colors');

const BYTES_PER_ALPHA_CHANNEL = 2;
const ENTRIES_NUMBER = 256;
const PALETTE_16_BIT_LENGTH = ENTRIES_NUMBER * colors.BYTES_PER_16_BIT_COLOR;
const PALETTE_16_BIT_ALPHA_LENGTH = ENTRIES_NUMBER * (colors.BYTES_PER_16_BIT_COLOR + BYTES_PER_ALPHA_CHANNEL);

const generate16BitPalette = () =>
    Buffer.alloc(PALETTE_16_BIT_LENGTH);

const generate16BitAlphaPalette = () =>
    Buffer.alloc(PALETTE_16_BIT_ALPHA_LENGTH);

const setEntry = (palette, index, color) => {
    let offset = index * (palette.length === PALETTE_16_BIT_ALPHA_LENGTH
        ? colors.BYTES_PER_16_BIT_COLOR + BYTES_PER_ALPHA_CHANNEL
        : colors.BYTES_PER_16_BIT_COLOR
    );
    for (let i = 0; i < color.length; i++) {
        palette[offset + i] = color[i];
    }
    return palette;
};

const getEntry = (palette, index) => {
    let entryLength = palette.length === PALETTE_16_BIT_ALPHA_LENGTH
        ? colors.BYTES_PER_16_BIT_COLOR + BYTES_PER_ALPHA_CHANNEL
        : colors.BYTES_PER_16_BIT_COLOR;
    let offset = index * entryLength;
    return palette.slice(offset, offset + entryLength);
};

module.exports = {
    generate16BitPalette,
    generate16BitAlphaPalette,
    setEntry,
    getEntry
};
