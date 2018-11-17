"use strict";

const digit = require('./structures/digit');
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

const generateRhombus = (terrainType, blendingType, brightness) =>
    Buffer.concat([
        defaults.generate(terrainType, blendingType),
        terrain.generate(terrainType),
        blending.generate(blendingType),
        brightness.generate(brightness),
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

const getRhombus = (rhombs, offsetX, offsetY) => {
    let mapSize = rhombs.mapSize;
    let offset = (offsetX + offsetY * mapSize) * BYTES_PER_RHOMBUS;
    return rhombs.slice(offset, offset + BYTES_PER_RHOMBUS);
};

const getRhombusTerrain = (rhombs, offsetX, offsetY) =>
    digit.toInt(getRhombus(rhombs, offsetX, offsetY).slice(OFFSET_TERRAIN, OFFSET_TERRAIN + terrain.BYTES_PER_TERRAIN));

const getRhombusBlending = (rhombs, offsetX, offsetY) =>
    digit.toInt(getRhombus(rhombs, offsetX, offsetY).slice(OFFSET_BLENDING, OFFSET_BLENDING + blending.BYTES_PER_BLENDING));

const getRhombusBrightness = (rhombs, offsetX, offsetY) =>
    digit.toInt(getRhombus(rhombs, offsetX, offsetY).slice(OFFSET_BRIGHTNESS, OFFSET_BRIGHTNESS + brightness.BYTES_PER_BRIGHTNESS));

const setRhombusTerrain = (rhombs, offsetX, offsetY, terrainType) => {
    let blendingType = getRhombusBlending(rhombs, offsetX, offsetY);
    let brightness = getRhombusBrightness(rhombs, offsetX, offsetY);
    return setRhombusProps(rhombs, offsetX, offsetY, terrainType, blendingType, brightness);
};

const setRhombusBlending = (rhombs, offsetX, offsetY, blendingType) => {
    let terrainType = getRhombusTerrain(rhombs, offsetX, offsetY);
    let brightness = getRhombusBrightness(rhombs, offsetX, offsetY);
    return setRhombusProps(rhombs, offsetX, offsetY, terrainType, blendingType, brightness);
};

const setRhombusBrightness = (rhombs, offsetX, offsetY, brightness) => {
    let terrainType = getRhombusTerrain(rhombs, offsetX, offsetY);
    let blendingType = getRhombusBlending(rhombs, offsetX, offsetY);
    return setRhombusProps(rhombs, offsetX, offsetY, terrainType, blendingType, brightness);
};

module.exports = {
    generate,
    setRhombusProps
};
