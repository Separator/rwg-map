"use strict";

const level = {
    MIN: 0x00,
    MAX: 0xf0,
    STEP: 0x10
};

const brightness = {
    LOW: 0x00,
    HIGH: 0x01
};

const generate = (type=brightness.HIGH, level=level.MIN) =>
    Buffer.from([level, type]);

module.exports = {
    ...level,
    ...brightness,
    generate
};
