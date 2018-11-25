"use strict";

const digit = require('./digit');
const terrain = require('./terrain');
const blending = require('./blending');

const BYTES_PER_DEFAULT = digit.BYTES_PER_TINY_DIGIT;
const VALUE_FOR_SOIL = 4;
const VALUE_FOR_OTHER_TERRAIN_TYPES = 0;

const replicatedBlendingTypes = [
    blending.types.TYPE_10_00,
    blending.types.TYPE_10_10,
    blending.types.TYPE_10_11,
    blending.types.TYPE_11_00,
    blending.types.TYPE_11_01,
    blending.types.TYPE_11_10,
    blending.types.TYPE_11_11
];

const generate = (terrainType = terrain.GRASS, blendingType = blending.types.TYPE_00_00) =>
    (replicatedBlendingTypes.indexOf(blendingType) > -1) ?
        digit.generate(terrainType, BYTES_PER_DEFAULT) :
        (terrainType === terrain.DRY_SOIL) ?
            digit.generate(VALUE_FOR_SOIL, BYTES_PER_DEFAULT) :
            digit.generate(VALUE_FOR_OTHER_TERRAIN_TYPES, BYTES_PER_DEFAULT);

module.exports = {
    BYTES_PER_DEFAULT,
    generate
};
