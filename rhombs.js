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

const generateRhombus = (terrainType, blendingType, brightnessLevel, brightnessType) =>
    Buffer.concat([
        defaults.generate(terrainType, blendingType),
        terrain.generate(terrainType),
        blending.generate(blendingType),
        brightness.generate(brightnessLevel, brightnessType),
        textures.generate(terrainType, blendingType)
    ], BYTES_PER_RHOMBUS);

const generate = (size=sizes.SMALL) =>
    Buffer.concat([...new Array(size * size)].map(() =>
        generateRhombus()), size * size * BYTES_PER_RHOMBUS);

const setSingleRhombus = (rhombs, offsetX, offsetY, terrainType, blendingType, brightnessLevel, brightnessType) => {
    let mapSize = Math.sqrt(rhombs.length / BYTES_PER_RHOMBUS);
    let offset = (offsetX + offsetY * mapSize) * BYTES_PER_RHOMBUS;
    return rhombs.fill(
        generateRhombus(terrainType, blendingType, brightnessLevel, brightnessType),
        offset,
        offset + BYTES_PER_RHOMBUS
    );
};

/*const setRhombusSubPoint = (rhombs, offsetX, offsetY)*/

module.exports = {
    generate,
    setSingleRhombus
};
