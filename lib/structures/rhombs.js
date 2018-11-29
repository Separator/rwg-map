"use strict";

const sizes = require('./sizes');
const defaults = require('./defaults');
const terrain = require('./terrain');
const blending = require('./blending');
const brightness = require('./brightness');
const textures = require('./textures');

const BYTES_PER_RHOMBUS =
    defaults.BYTES_PER_DEFAULT + terrain.BYTES_PER_TERRAIN + blending.BYTES_PER_BLENDING +
    brightness.BYTES_PER_BRIGHTNESS + textures.BYTES_PER_TEXTURE;
const OFFSET_DEFAULT = 0;
const OFFSET_TERRAIN = OFFSET_DEFAULT + defaults.BYTES_PER_DEFAULT;
const OFFSET_BLENDING = OFFSET_TERRAIN + terrain.BYTES_PER_TERRAIN;
const OFFSET_BRIGHTNESS = OFFSET_BLENDING + blending.BYTES_PER_BLENDING;
const OFFSET_TEXTURE = OFFSET_BRIGHTNESS + brightness.BYTES_PER_BRIGHTNESS;

const generateRhombus = (terrainType, blendingType, brightnessValue) =>
    Buffer.concat([
        defaults.generate(terrainType, blendingType),
        terrain.generate(terrainType),
        blending.generate(blendingType),
        brightness.generate(brightnessValue),
        textures.generate(terrainType, blendingType)
    ], BYTES_PER_RHOMBUS);

const generate = (size=sizes.SMALL) => {
    let result = Buffer.concat([...new Array(size * size)].map(() =>
        generateRhombus()), size * size * BYTES_PER_RHOMBUS);
    result.mapSize = size;
    return result;
};

const setRhombusProps = (rhombs, offsetX, offsetY, terrainType, blendingType, brightness) => {
    let mapSize = rhombs.mapSize;
    let offset = (offsetX + offsetY * mapSize) * BYTES_PER_RHOMBUS;
    return rhombs.fill(
        generateRhombus(terrainType, blendingType, brightness),
        offset,
        offset + BYTES_PER_RHOMBUS
    );
};

module.exports = {
    generate,
    setRhombusProps
};
