"use strict";

const terrain = require('./terrain');
const blending = require('./blending');

const EMPTY = Buffer.from([0x00, 0x00]);
const SOIL_FULL = Buffer.from([0x88, 0x00]); //[136]

const textures = {
    [terrain.GRASS]: {
        [blending.types.TYPE_00_00]: EMPTY,
        [blending.types.TYPE_11_11]: Buffer.from([0x00, 0x00]),
        [blending.types.TYPE_00_11]: Buffer.from([0x01, 0x00]),
        [blending.types.TYPE_00_10]: Buffer.from([0x02, 0x00]),
        [blending.types.TYPE_10_10]: Buffer.from([0x03, 0x00]),
        [blending.types.TYPE_10_00]: Buffer.from([0x04, 0x00]),
        [blending.types.TYPE_11_00]: Buffer.from([0x05, 0x00]),
        [blending.types.TYPE_01_00]: Buffer.from([0x06, 0x00]),
        [blending.types.TYPE_01_01]: Buffer.from([0x07, 0x00]),
        [blending.types.TYPE_00_01]: Buffer.from([0x08, 0x00]),
        [blending.types.TYPE_11_10]: Buffer.from([0x09, 0x00]),
        [blending.types.TYPE_11_01]: Buffer.from([0x0a, 0x00]),
        [blending.types.TYPE_01_11]: Buffer.from([0x0b, 0x00]),
        [blending.types.TYPE_10_11]: Buffer.from([0x0c, 0x00])
    },
    [terrain.ARABLE]: {
        [blending.types.TYPE_00_00]: EMPTY,
        [blending.types.TYPE_11_11]: Buffer.from([0x0d, 0x00]),     //[13,14,15,16,19,21,22,23],
        [blending.types.TYPE_00_11]: Buffer.from([0x1f, 0x00]),     //[31,43,55,63],
        [blending.types.TYPE_00_10]: Buffer.from([0x23, 0x00]),     //[35,47,67],
        [blending.types.TYPE_10_10]: Buffer.from([0x21, 0x00]),     //[33,45,65],
        [blending.types.TYPE_10_00]: Buffer.from([0x24, 0x00]),     //[36,48,68],
        [blending.types.TYPE_11_00]: Buffer.from([0x1b, 0x00]),     //[27,39,51,59],
        [blending.types.TYPE_01_00]: Buffer.from([0x25, 0x00]),     //[37,49,69],
        [blending.types.TYPE_01_01]: Buffer.from([0x35, 0x00]),     //[53,61],
        [blending.types.TYPE_00_01]: Buffer.from([0x22, 0x00]),     //[34,46,66],
        [blending.types.TYPE_11_10]: Buffer.from([0x1a, 0x00]),     //[26,38,50],
        [blending.types.TYPE_11_01]: Buffer.from([0x1c, 0x00]),     //[28,52,60],
        [blending.types.TYPE_01_11]: Buffer.from([0x1e, 0x00]),     //[30,54,62],
        [blending.types.TYPE_10_11]: Buffer.from([0x2c, 0x00])      //[44,56,64]
    },
    [terrain.ASPHALT]: {
        [blending.types.TYPE_00_00]: EMPTY,
        [blending.types.TYPE_11_11]: Buffer.from([0x46, 0x00]),     //[70,71,73],
        [blending.types.TYPE_00_11]: Buffer.from([0x61, 0x00]),     //[97,109],
        [blending.types.TYPE_00_10]: Buffer.from([0x59, 0x00]),     //[89,101,113],
        [blending.types.TYPE_10_10]: Buffer.from([0x6f, 0x00]),     //[111,123],
        [blending.types.TYPE_10_00]: Buffer.from([0x7e, 0x00]),     //[126],
        [blending.types.TYPE_11_00]: Buffer.from([0x69, 0x00]),     //[105],
        [blending.types.TYPE_01_00]: Buffer.from([0x67, 0x00]),     //[103],
        [blending.types.TYPE_01_01]: Buffer.from([0x5f, 0x00]),     //[95],
        [blending.types.TYPE_00_01]: Buffer.from([0x7c, 0x00]),     //[124],
        [blending.types.TYPE_11_10]: Buffer.from([0x50, 0x00]),     //[80],
        [blending.types.TYPE_11_01]: Buffer.from([0x76, 0x00]),     //[118],
        [blending.types.TYPE_01_11]: Buffer.from([0x60, 0x00]),     //[96],
        [blending.types.TYPE_10_11]: Buffer.from([0x56, 0x00])      //[86]
    },
    [terrain.SOIL]: {
        [blending.types.TYPE_00_00]: EMPTY,
        [blending.types.TYPE_11_11]: SOIL_FULL,
        [blending.types.TYPE_00_11]: Buffer.from([0x9a, 0x00]),     //[154],
        [blending.types.TYPE_00_10]: Buffer.from([0x92, 0x00]),     //[146],
        [blending.types.TYPE_10_10]: Buffer.from([0x90, 0x00]),     //[144],
        [blending.types.TYPE_10_00]: Buffer.from([0x9f, 0x00]),     //[159],
        [blending.types.TYPE_11_00]: Buffer.from([0xae, 0x00]),     //[174],
        [blending.types.TYPE_01_00]: Buffer.from([0xa0, 0x00]),     //[160],
        [blending.types.TYPE_01_01]: Buffer.from([0xb0, 0x00]),     //[176],
        [blending.types.TYPE_00_01]: Buffer.from([0x91, 0x00]),     //[145],
        [blending.types.TYPE_11_10]: Buffer.from([0xad, 0x00]),     //[173],
        [blending.types.TYPE_11_01]: Buffer.from([0x8b, 0x00]),     //[139],
        [blending.types.TYPE_01_11]: Buffer.from([0xb1, 0x00]),     //[177],
        [blending.types.TYPE_10_11]: Buffer.from([0x8f, 0x00])      //[143]
    },
    [terrain.DRY_SOIL]: {
        [blending.types.TYPE_00_00]: SOIL_FULL,
        [blending.types.TYPE_11_11]: Buffer.from([0xbd, 0x00]),     //[189],
        [blending.types.TYPE_00_11]: Buffer.from([0xea, 0x00]),     //[234],
        [blending.types.TYPE_00_10]: Buffer.from([0xdf, 0x00]),     //[223],
        [blending.types.TYPE_10_10]: Buffer.from([0xd4, 0x00]),     //[212],
        [blending.types.TYPE_10_00]: Buffer.from([0xed, 0x00]),     //[237],
        [blending.types.TYPE_11_00]: Buffer.from([0xe2, 0x00]),     //,[226],
        [blending.types.TYPE_01_00]: Buffer.from([0xcb, 0x00]),     //[203],
        [blending.types.TYPE_01_01]: Buffer.from([0xd8, 0x00]),     //[216],
        [blending.types.TYPE_00_01]: Buffer.from([0xe9, 0x00]),     //[233],
        [blending.types.TYPE_11_10]: Buffer.from([0xf1, 0x00]),     //[241],
        [blending.types.TYPE_11_01]: Buffer.from([0xe6, 0x00]),     //[230],
        [blending.types.TYPE_01_11]: Buffer.from([0xf3, 0x00]),     //[243],
        [blending.types.TYPE_10_11]: Buffer.from([0xf4, 0x00])      //[244]
    },
    [terrain.WATER]: {
        [blending.types.TYPE_00_00]: EMPTY,
        [blending.types.TYPE_11_11]: Buffer.from([0xfe, 0x00]),     //[254],
        [blending.types.TYPE_00_11]: Buffer.from([0x1c, 0x01]),     //
        [blending.types.TYPE_00_10]: Buffer.from([0x20, 0x01]),
        [blending.types.TYPE_10_10]: Buffer.from([0x12, 0x01]),
        [blending.types.TYPE_10_00]: Buffer.from([0x09, 0x01]),
        [blending.types.TYPE_11_00]: Buffer.from([0x18, 0x01]),
        [blending.types.TYPE_01_00]: Buffer.from([0x16, 0x01]),
        [blending.types.TYPE_01_01]: Buffer.from([0x0e, 0x01]),
        [blending.types.TYPE_00_01]: Buffer.from([0x07, 0x01]),
        [blending.types.TYPE_11_10]: Buffer.from([0x0b, 0x01]),
        [blending.types.TYPE_11_01]: Buffer.from([0x01, 0x01]),
        [blending.types.TYPE_01_11]: Buffer.from([0x1b, 0x01]),
        [blending.types.TYPE_10_11]: Buffer.from([0x11, 0x01])
    },
    [terrain.SAND]: {
        [blending.types.TYPE_00_00]: EMPTY,
        [blending.types.TYPE_11_11]: Buffer.from([0x26, 0x01]),
        [blending.types.TYPE_00_11]: Buffer.from([0x43, 0x01]),
        [blending.types.TYPE_00_10]: Buffer.from([0x3b, 0x01]),
        [blending.types.TYPE_10_10]: Buffer.from([0x5c, 0x01]),
        [blending.types.TYPE_10_00]: Buffer.from([0x5f, 0x01]),
        [blending.types.TYPE_11_00]: Buffer.from([0x4b, 0x01]),
        [blending.types.TYPE_01_00]: Buffer.from([0x3d, 0x01]),
        [blending.types.TYPE_01_01]: Buffer.from([0x41, 0x01]),
        [blending.types.TYPE_00_01]: Buffer.from([0x46, 0x01]),
        [blending.types.TYPE_11_10]: Buffer.from([0x4a, 0x01]),
        [blending.types.TYPE_11_01]: Buffer.from([0x58, 0x01]),
        [blending.types.TYPE_01_11]: Buffer.from([0x5a, 0x01]),
        [blending.types.TYPE_10_11]: Buffer.from([0x61, 0x01])
    }
};

const generate = (terrainType=terrain.GRASS, blendingType=blending.types.TYPE_00_00) =>
    textures[terrainType][blendingType];

module.exports = {
    generate
};
