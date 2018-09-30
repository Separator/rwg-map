"use strict";

const sizes = require('./structures/sizes');
const BYTES_PER_RHOMBUS = 8;

// 4 байт - уровень освещённости 00-10-20--f0
// 5 байт - тип освещения, 00 - затемнение, 01 - осветление

const ENTITIES = {
    GRASS: Buffer.from([0x00, 0x00, 0x00]),                 // ‭0000 ‭0000 ‭0000 ‭0000 ‭0000 ‭0000

    // top left
    ARABLE: Buffer.from([0x02, 0x02, 0x04]),                // ‭0000 0010‬ 0000 0010 0000 0100
    ASPHALT: Buffer.from([0x03, 0x03, 0x04]),               // ‭0000 0011‬ 0000 0011 0000 0100
    SOIL: Buffer.from([0x04, 0x04, 0x04]),                  // ‭0000 0100‬ 0000 0100‬ 0000 0100
    DRY_SOIL: Buffer.from([0x05, 0x05, 0x04]),              // ‭0000 0101 0000 0101 0000 0100
    WATER: Buffer.from([0x06, 0x06, 0x04]),                 // ‭0000 0110 0000 0110 0000 0100
    SAND: Buffer.from([0x07, 0x07, 0x04]),                  // ‭0000 0111 0000 0111 0000 0100

    // top right
    ARABLE: Buffer.from([0x00, 0x02, 0x06]),                // ‭0000 ‭0000 0000 0010 0000 0110
    ASPHALT: Buffer.from([0x00, 0x03, 0x06]),               // ‭0000 ‭0000 0000 0011 0000 0110
    SOIL: Buffer.from([0x00, 0x04, 0x06]),                  // ‭0000 ‭0000 0000 0100‬ 0000 0110
    DRY_SOIL: Buffer.from([0x04, 0x05, 0x06]),              // ‭0000 0100‬ 0000 0101 0000 0110
    WATER: Buffer.from([0x00, 0x06, 0x06]),                 // ‭0000 ‭0000 0000 0110 0000 0110
    SAND: Buffer.from([0x00, 0x07, 0x06]),                  // ‭0000 ‭0000 0000 0111 0000 0110

    // bot left
    ARABLE: Buffer.from([0x00, 0x02, 0x02]),                // ‭0000 ‭0000 0000 0010 0000 0010
    ASPHALT: Buffer.from([0x00, 0x03, 0x02]),               // ‭0000 ‭0000 0000 0011 0000 0010
    SOIL: Buffer.from([0x00, 0x04, 0x02]),                  // ‭0000 ‭0000 0000 0100‬ 0000 0010
    DRY_SOIL: Buffer.from([0x04, 0x05, 0x02]),              // ‭0000 0100‬ 0000 0101 0000 0010
    WATER: Buffer.from([0x00, 0x06, 0x02]),                 // ‭0000 ‭0000 0000 0110 0000 0010
    SAND: Buffer.from([0x00, 0x07, 0x02]),                  // ‭0000 ‭0000 0000 0111 0000 0010

    // bot right:
    ARABLE: Buffer.from([0x00, 0x02, 0x08]),                // ‭0000 ‭0000 0000 0010 0000 1000
    ASPHALT: Buffer.from([0x00, 0x03, 0x08]),               // ‭0000 ‭0000 0000 0011 0000 1000
    SOIL: Buffer.from([0x00, 0x04, 0x08]),                  // ‭0000 ‭0000 0000 0100‬ 0000 1000
    DRY_SOIL: Buffer.from([0x04, 0x05, 0x08]),              // ‭0000 0100‬ 0000 0101 0000 1000
    WATER: Buffer.from([0x00, 0x06, 0x08]),                 // ‭0000 ‭0000 0000 0110 0000 1000
    SAND: Buffer.from([0x00, 0x07, 0x08]),                  // ‭0000 ‭0000 0000 0111 0000 1000

    // all top:
    ARABLE: Buffer.from([0x02, 0x02, 0x05]),                // ‭0000 ‭0010 0000 ‭0010 0000 0101
    ASPHALT: Buffer.from([0x03, 0x03, 0x05]),               // ‭0000 ‭0011 0000 ‭0011 0000 0101
    SOIL: Buffer.from([0x04, 0x04, 0x05]),                  // ‭0000 ‭0100 0000 ‭0100 0000 0101
    DRY_SOIL: Buffer.from([0x05, 0x05, 0x05]),              // ‭0000 0101 0000 0101 0000 0101
    WATER: Buffer.from([0x06, 0x06, 0x05]),                 // ‭0000 0110 0000 0110 0000 0101
    SAND: Buffer.from([0x07, 0x07, 0x05]),                  // ‭0000 0111 0000 0111 0000 0101

    // all right:
    ARABLE: Buffer.from([0x00, 0x02, 0x07]),                // ‭0000 ‭0000 0000 ‭0010 0000 0111
    ASPHALT: Buffer.from([0x00, 0x03, 0x07]),               // ‭0000 ‭0000 0000 ‭0011 0000 0111
    SOIL: Buffer.from([0x00, 0x04, 0x07]),                  // ‭0000 ‭0000 0000 ‭0100 0000 0111
    DRY_SOIL: Buffer.from([0x04, 0x05, 0x07]),              // ‭0000 ‭0100 0000 0101 0000 0111
    WATER: Buffer.from([0x00, 0x06, 0x07]),                 // ‭0000 ‭0000 0000 0110 0000 0111
    SAND: Buffer.from([0x00, 0x07, 0x07]),                  // ‭0000 ‭0000 0000 0111 0000 0111

    // all bottom:
    ARABLE: Buffer.from([0x00, 0x02, 0x01]),                // ‭0000 ‭0000 0000 ‭0010 0000 0001
    ASPHALT: Buffer.from([0x00, 0x03, 0x01]),               // ‭0000 ‭0000 0000 ‭0011 0000 0001
    SOIL: Buffer.from([0x00, 0x04, 0x01]),                  // ‭0000 ‭0000 0000 ‭0100 0000 0001
    DRY_SOIL: Buffer.from([0x04, 0x05, 0x01]),              // ‭0000 ‭0100 0000 0101 0000 0001
    WATER: Buffer.from([0x00, 0x06, 0x01]),                 // ‭0000 ‭0000 0000 0110 0000 0001
    SAND: Buffer.from([0x00, 0x07, 0x01]),                  // ‭0000 ‭0000 0000 0111 0000 0001

    // all left:
    ARABLE: Buffer.from([0x02, 0x02, 0x03]),                // ‭0000 ‭0010 0000 ‭0010 0000 0011
    ASPHALT: Buffer.from([0x03, 0x03, 0x03]),               // ‭0000 0011 0000 0011 0000 0011
    SOIL: Buffer.from([0x04, 0x04, 0x03]),                  // ‭0000 ‭0100 0000 ‭0100 0000 0011
    DRY_SOIL: Buffer.from([0x05, 0x05, 0x03]),              // ‭0000 0101 0000 0101 0000 0011
    WATER: Buffer.from([0x06, 0x06, 0x03]),                 // ‭0000 0110 0000 0110 0000 0011
    SAND: Buffer.from([0x07, 0x07, 0x03]),                  // ‭0000 0111 0000 0111 0000 0011

    // top left, all bottom:
    ARABLE: Buffer.from([0x02, 0x02, 0x0c]),                // ‭0000 ‭0010 0000 ‭0010 0000 1100
    ASPHALT: Buffer.from([0x03, 0x03, 0x0c]),               // ‭0000 0011 0000 0011 0000 1100
    SOIL: Buffer.from([0x04, 0x04, 0x0c]),                  // ‭0000 ‭0100 0000 ‭0100 0000 1100
    DRY_SOIL: Buffer.from([0x05, 0x05, 0x0c]),              // ‭0000 0101 0000 0101 0000 1100
    WATER: Buffer.from([0x06, 0x06, 0x0c]),                 // ‭0000 0110 0000 0110 0000 1100
    SAND: Buffer.from([0x07, 0x07, 0x0c]),                  // ‭0000 0111 0000 0111 0000 1100

    // bottom right, all top:
    ARABLE: Buffer.from([0x02, 0x02, 0x0a]),                // ‭0000 ‭0010 0000 ‭0010 0000 1010
    ASPHALT: Buffer.from([0x03, 0x03, 0x0a]),               // ‭0000 0011 0000 0011 0000 1010
    SOIL: Buffer.from([0x04, 0x04, 0x0a]),                  // ‭0000 ‭0100 0000 ‭0100 0000 1010
    DRY_SOIL: Buffer.from([0x05, 0x05, 0x0a]),              // ‭0000 0101 0000 0101 0000 1010
    WATER: Buffer.from([0x06, 0x06, 0x0a]),                 // ‭0000 0110 0000 0110 0000 1010
    SAND: Buffer.from([0x07, 0x07, 0x0a]),                  // ‭0000 0111 0000 0111 0000 1010

    // top right, all bottom:
    ARABLE: Buffer.from([0x00, 0x02, 0x0b]),                // ‭0000 ‭0000 0000 ‭0010 0000 1011
    ASPHALT: Buffer.from([0x00, 0x03, 0x0b]),               // ‭0000 ‭0000 0000 0011 0000 1011
    SOIL: Buffer.from([0x00, 0x04, 0x0b]),                  // ‭0000 ‭0000 0000 ‭0100 0000 1011
    DRY_SOIL: Buffer.from([0x04, 0x05, 0x0b]),              // ‭0000 0100 0000 0101 0000 1011
    WATER: Buffer.from([0x00, 0x06, 0x0b]),                 // ‭0000 ‭0000 0000 0110 0000 1011
    SAND: Buffer.from([0x00, 0x07, 0x0b]),                  // ‭0000 ‭0000 0000 0111 0000 1011

    // bottom left, all top:
    ARABLE: Buffer.from([0x02, 0x02, 0x09]),                // ‭0000 ‭0010 0000 ‭0010 0000 1001
    ASPHALT: Buffer.from([0x03, 0x03, 0x09]),               // ‭0000 0011 0000 0011 0000 1001
    SOIL: Buffer.from([0x04, 0x04, 0x09]),                  // ‭0000 ‭0100 0000 ‭0100 0000 1001
    DRY_SOIL: Buffer.from([0x05, 0x05, 0x09]),              // ‭0000 0101 0000 0101 0000 1001
    WATER: Buffer.from([0x06, 0x06, 0x09]),                 // ‭0000 0110 0000 0110 0000 1001
    SAND: Buffer.from([0x07, 0x07, 0x09]),                  // ‭0000 0111 0000 0111 0000 1001

    // all:
    ARABLE: Buffer.from([0x02, 0x02, 0x00]),                // ‭0000 ‭0010 0000 ‭0010 0000 0000
    ASPHALT: Buffer.from([0x03, 0x03, 0x00]),               // ‭0000 0011 0000 0011 0000 0000
    SOIL: Buffer.from([0x04, 0x04, 0x00]),                  // ‭0000 ‭0100 0000 ‭0100 0000 0000
    DRY_SOIL: Buffer.from([0x05, 0x05, 0x00]),              // ‭0000 0101 0000 0101 0000 0000
    WATER: Buffer.from([0x06, 0x06, 0x00]),                 // ‭0000 0110 0000 0110 0000 0000
    SAND: Buffer.from([0x07, 0x07, 0x00]),                  // ‭0000 0111 0000 0111 0000 0000

    /*MOWERS: [
        Buffer.from([0x00, 0x04]),                          // 0000 0000 0000 0100
        Buffer.from([0x00, 0x08]),                          // 0000 0000 0000 1000
        Buffer.from([0x00, 0x10]),                          // 0000 0000 0001 0000
        Buffer.from([0x00, 0x20]),                          // 0000 0000 0010 0000
    ]*/
};

const generate = (size=sizes.SMALL) =>
    Buffer.alloc(size * size * BYTES_PER_RHOMBUS);

module.exports = {
    generate
};