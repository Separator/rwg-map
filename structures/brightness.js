"use strict";

const BYTES_PER_BRIGHTNESS = 2;
const LEVEL = 0;
const TYPE = 1;
const STEP = 0x10;

const brightnessLevel = {
    MIN: 0x00,
    MAX: 0xf0,
    STEP: STEP
};

const brightnessType = {
    LOW: 0x00,
    HIGH: 0x01
};

const generate = (level=brightnessLevel.MIN, type=brightnessType.HIGH) =>
    Buffer.from([level, type]);

const increment = brightness =>
    (brightness[LEVEL] < brightnessLevel.MAX) ?
        generate(brightness[LEVEL] + STEP, brightness[TYPE]) :
        (brightness[TYPE] === brightnessType.HIGH) ?
            generate(brightness[LEVEL], brightness[TYPE]) :
            generate(brightnessLevel.MIN, brightnessType.HIGH);

const decrement = brightness =>
    (brightness[LEVEL] > brightnessLevel.MIN) ?
        generate(brightness[LEVEL] - STEP, brightness[TYPE]) :
        (brightness[TYPE] === brightnessType.LOW) ?
            generate(brightness[LEVEL], brightness[TYPE]) :
            generate(brightnessLevel.MAX, brightnessType.LOW);

module.exports = {
    BYTES_PER_BRIGHTNESS,
    ...brightnessLevel,
    ...brightnessType,
    generate,
    increment,
    decrement
};
