"use strict";

const BYTES_PER_16_BIT_COLOR = 2;
const BYTES_PER_24_BIT_COLOR = 3;
const BIT_PER_16_RED = 5;
const BIT_PER_16_GREEN = 6;
const BIT_PER_16_BLUE = 5;
const BIT_PER_24_RED = 8;
const BIT_PER_24_GREEN = 8;
const BIT_PER_24_BLUE = 8;

const genColor = (colorCode=0, size) => {
    const buf = Buffer.alloc(size);
    for (let i = 0; i < size; i++) {
        let offset = size - i - 1;
        buf[i] = (colorCode >>> (offset * 8)) & 0xff;
    }
    return buf;
};

const gen16BitColor = (colorCode=0) =>
    genColor(colorCode, BYTES_PER_16_BIT_COLOR);

const gen24BitColor = (colorCode=0) =>
    genColor(colorCode, BYTES_PER_24_BIT_COLOR);

const getColorCode = color => {
    let size = color.length;
    let result = 0;
    for (let i = 0; i < size; i++) {
        let offset = size - i - 1;
        result |= color[i] << (offset * 8);
    }
    return result;
};

const getCodeRedComponent = (code, size) => {
    let offset = size === BYTES_PER_16_BIT_COLOR
        ? BIT_PER_16_GREEN + BIT_PER_16_BLUE
        : BIT_PER_24_GREEN + BIT_PER_24_BLUE;
    return code >>> offset;
};

const getCodeGreenComponent = (code, size) => {
    let offsetLeft = size === BYTES_PER_16_BIT_COLOR
        ? BIT_PER_16_RED
        : BIT_PER_24_RED;
    let offsetRight = size === BYTES_PER_16_BIT_COLOR
        ? BIT_PER_16_RED + BIT_PER_16_BLUE
        : BIT_PER_24_RED + BIT_PER_24_BLUE;
    return (code << offsetLeft) >>> offsetRight;
};

const getCodeBlueComponent = (code, size) => {
    let offset = size === BYTES_PER_16_BIT_COLOR
        ? BIT_PER_16_RED + BIT_PER_16_GREEN
        : BIT_PER_24_RED + BIT_PER_24_GREEN;
    return code << offset;
};

const getColorRedComponent = color =>
    getCodeRedComponent(getColorCode(color), color.size);

const getColorGreenComponent = color =>
    getCodeGreenComponent(getColorCode(color), color.size);

const getColorBlueComponent = color =>
    getCodeBlueComponent(getColorCode(color), color.size);

const genColorByComponents = (red, green, blue, size) => {
    let offsetGreen = size === BYTES_PER_16_BIT_COLOR ? BIT_PER_16_GREEN : BIT_PER_24_GREEN;
    let offsetBlue = size === BYTES_PER_16_BIT_COLOR ? BIT_PER_16_BLUE : BIT_PER_24_BLUE;
    let code = (red << (offsetGreen + offsetBlue)) | (green << offsetBlue) | blue;
    return genColor(code, size);
};

const convertFrom16To24Color = color => {
    let code = getColorCode(color);
    let red = ((code & 0xF800) >>> 11) * 8;
    let green = ((code & 0x7E0) >>> 5) * 4;
    let blue = (code & 0x1F) * 8;
    return genColorByComponents(red, green, blue, BYTES_PER_24_BIT_COLOR);
};

const convertFrom24To16Color = color => {
    let red = getColorRedComponent(color);
    let green = getColorGreenComponent(color);
    let blue = getColorBlueComponent(color);
    let code = (Math.floor(red / 8) << 11) + (Math.floor(green / 4) << 5) + Math.floor(blue / 8);
    return genColor(code, BYTES_PER_16_BIT_COLOR);
};

module.exports = {
    BYTES_PER_16_BIT_COLOR,
    BYTES_PER_24_BIT_COLOR,
    genColor,
    gen16BitColor,
    gen24BitColor,
    getColorCode,
    getCodeRedComponent,
    getCodeGreenComponent,
    getCodeBlueComponent,
    getColorRedComponent,
    getColorGreenComponent,
    getColorBlueComponent,
    genColorByComponents,
    convertFrom16To24Color,
    convertFrom24To16Color
};
