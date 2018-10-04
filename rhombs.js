"use strict";

const sizes = require('./structures/sizes');

const defaults = require('./structures/defaults');
const terrain = require('./structures/terrain');
const blending = require('./structures/blending');
const brightness = require('./structures/brightness');
const textures = require('./structures/textures');

const BYTES_PER_RHOMBUS =
    defaults.BYTES_PER_DEFAULT + terrain.BYTES_PER_TERRAIN + blending.BYTES_PER_BLENDING +
    brightness.BYTES_PER_BRIGHTNESS + textures.BYTES_PER_TEXTURE;
const OFFSET_DEFAULT = 0;
const OFFSET_TERRAIN = OFFSET_DEFAULT + defaults.BYTES_PER_DEFAULT;
const OFFSET_BLENDING = OFFSET_TERRAIN + terrain.BYTES_PER_TERRAIN;
const OFFSET_BRIGHTNESS = OFFSET_BLENDING + blending.BYTES_PER_BLENDING;
const OFFSET_TEXTURE = OFFSET_BRIGHTNESS + brightness.BYTES_PER_BRIGHTNESS;

const generate = (size=sizes.SMALL) =>
    Buffer.alloc(size * size * BYTES_PER_RHOMBUS);

const setSingleRhombus = (rhombs, offsetX, offsetY, terrainType, blendingType, brightnessLevel, brightnessType) => {
    let mapSize = Math.sqrt(rhombs.length / BYTES_PER_RHOMBUS);
    let offset = (offsetX + offsetY * mapSize) * BYTES_PER_RHOMBUS;
    return rhombs.fill(
        Buffer.concat([
            defaults.generate(terrainType, blendingType),
            terrain.generate(terrainType),
            blending.generate(blendingType),
            brightness.generate(brightnessLevel, brightnessType),
            textures.generate(terrainType, blendingType)
        ], BYTES_PER_RHOMBUS),
        offset,
        offset + BYTES_PER_RHOMBUS
    );
};

/*const setBrightness = (rhombs, offsetX, offsetY, brightnessLevel, brightnessType) =>
    setSingleRhombus(rhombs, offsetX, offsetY, );*/

module.exports = {
    generate,
    setSingleRhombus
};

/*const ENTITIES = {
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
};*/
