"use strict";

const digit = require('./digit');
const BYTES_PER_BRIGHTNESS = digit.BYTES_PER_SMALL_DIGIT;

const levels = {
    DEFAULT: 0x100,
    MIN: 0x00,
    MAX: 0x1f0,
    STEP: 0x10
};

const generate = (level=levels.DEFAULT) =>
    (level % levels.STEP)
        ? levels.DEFAULT
        : digit.generate(level, BYTES_PER_BRIGHTNESS);

const increment = brightness =>
    ((digit.toInt(brightness) + levels.STEP) <= levels.MAX)
        ? generate(digit.toInt(brightness) + levels.STEP)
        : brightness;

const decrement = brightness =>
    ((digit.toInt(brightness) - levels.STEP) >= levels.MIN)
        ? generate(digit.toInt(brightness) - levels.STEP)
        : brightness;

module.exports = {
    BYTES_PER_BRIGHTNESS,
    levels,
    ...levels,
    generate,
    increment,
    decrement
};
