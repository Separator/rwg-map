"use strict";

const digit = require('./digit');
const terrain = require('./terrain');
const blending = require('./blending');
const BYTES_PER_TEXTURE = digit.BYTES_PER_SMALL_DIGIT;

const texture = textureNumber =>
    digit.generate(textureNumber, BYTES_PER_TEXTURE);

const EMPTY = texture(0);
const SOIL_FULL = texture(136);

const textures = {
    [terrain.types.GRASS]: {
        [blending.types.TYPE_00_00]: EMPTY,
        [blending.types.TYPE_11_11]: texture(0),
        [blending.types.TYPE_00_11]: texture(1),
        [blending.types.TYPE_00_10]: texture(2),
        [blending.types.TYPE_10_10]: texture(3),
        [blending.types.TYPE_10_00]: texture(4),
        [blending.types.TYPE_11_00]: texture(5),
        [blending.types.TYPE_01_00]: texture(6),
        [blending.types.TYPE_01_01]: texture(7),
        [blending.types.TYPE_00_01]: texture(8),
        [blending.types.TYPE_11_10]: texture(9),
        [blending.types.TYPE_11_01]: texture(10),
        [blending.types.TYPE_01_11]: texture(11),
        [blending.types.TYPE_10_11]: texture(12)
    },
    [terrain.types.ARABLE]: {
        [blending.types.TYPE_00_00]: EMPTY,
        [blending.types.TYPE_11_11]: texture(13),
        [blending.types.TYPE_00_11]: texture(31),
        [blending.types.TYPE_00_10]: texture(35),
        [blending.types.TYPE_10_10]: texture(33),
        [blending.types.TYPE_10_00]: texture(36),
        [blending.types.TYPE_11_00]: texture(27),
        [blending.types.TYPE_01_00]: texture(37),
        [blending.types.TYPE_01_01]: texture(53),
        [blending.types.TYPE_00_01]: texture(34),
        [blending.types.TYPE_11_10]: texture(26),
        [blending.types.TYPE_11_01]: texture(28),
        [blending.types.TYPE_01_11]: texture(30),
        [blending.types.TYPE_10_11]: texture(44)
    },
    [terrain.types.ASPHALT]: {
        [blending.types.TYPE_00_00]: EMPTY,
        [blending.types.TYPE_11_11]: texture(70),
        [blending.types.TYPE_00_11]: texture(97),
        [blending.types.TYPE_00_10]: texture(89),
        [blending.types.TYPE_10_10]: texture(111),
        [blending.types.TYPE_10_00]: texture(126),
        [blending.types.TYPE_11_00]: texture(105),
        [blending.types.TYPE_01_00]: texture(103),
        [blending.types.TYPE_01_01]: texture(95),
        [blending.types.TYPE_00_01]: texture(124),
        [blending.types.TYPE_11_10]: texture(80),
        [blending.types.TYPE_11_01]: texture(118),
        [blending.types.TYPE_01_11]: texture(96),
        [blending.types.TYPE_10_11]: texture(86)
    },
    [terrain.types.SOIL]: {
        [blending.types.TYPE_00_00]: EMPTY,
        [blending.types.TYPE_11_11]: SOIL_FULL,
        [blending.types.TYPE_00_11]: texture(154),
        [blending.types.TYPE_00_10]: texture(146),
        [blending.types.TYPE_10_10]: texture(144),
        [blending.types.TYPE_10_00]: texture(159),
        [blending.types.TYPE_11_00]: texture(174),
        [blending.types.TYPE_01_00]: texture(160),
        [blending.types.TYPE_01_01]: texture(176),
        [blending.types.TYPE_00_01]: texture(145),
        [blending.types.TYPE_11_10]: texture(173),
        [blending.types.TYPE_11_01]: texture(139),
        [blending.types.TYPE_01_11]: texture(177),
        [blending.types.TYPE_10_11]: texture(143)
    },
    [terrain.types.DRY_SOIL]: {
        [blending.types.TYPE_00_00]: SOIL_FULL,
        [blending.types.TYPE_11_11]: texture(189),
        [blending.types.TYPE_00_11]: texture(234),
        [blending.types.TYPE_00_10]: texture(223),
        [blending.types.TYPE_10_10]: texture(212),
        [blending.types.TYPE_10_00]: texture(237),
        [blending.types.TYPE_11_00]: texture(226),
        [blending.types.TYPE_01_00]: texture(203),
        [blending.types.TYPE_01_01]: texture(216),
        [blending.types.TYPE_00_01]: texture(233),
        [blending.types.TYPE_11_10]: texture(241),
        [blending.types.TYPE_11_01]: texture(230),
        [blending.types.TYPE_01_11]: texture(243),
        [blending.types.TYPE_10_11]: texture(244)
    },
    [terrain.types.WATER]: {
        [blending.types.TYPE_00_00]: EMPTY,
        [blending.types.TYPE_11_11]: texture(254),
        [blending.types.TYPE_00_11]: texture(284),
        [blending.types.TYPE_00_10]: texture(288),
        [blending.types.TYPE_10_10]: texture(274),
        [blending.types.TYPE_10_00]: texture(265),
        [blending.types.TYPE_11_00]: texture(280),
        [blending.types.TYPE_01_00]: texture(278),
        [blending.types.TYPE_01_01]: texture(270),
        [blending.types.TYPE_00_01]: texture(263),
        [blending.types.TYPE_11_10]: texture(267),
        [blending.types.TYPE_11_01]: texture(257),
        [blending.types.TYPE_01_11]: texture(283),
        [blending.types.TYPE_10_11]: texture(273)
    },
    [terrain.types.SAND]: {
        [blending.types.TYPE_00_00]: EMPTY,
        [blending.types.TYPE_11_11]: texture(294),
        [blending.types.TYPE_00_11]: texture(323),
        [blending.types.TYPE_00_10]: texture(315),
        [blending.types.TYPE_10_10]: texture(348),
        [blending.types.TYPE_10_00]: texture(351),
        [blending.types.TYPE_11_00]: texture(331),
        [blending.types.TYPE_01_00]: texture(317),
        [blending.types.TYPE_01_01]: texture(321),
        [blending.types.TYPE_00_01]: texture(326),
        [blending.types.TYPE_11_10]: texture(330),
        [blending.types.TYPE_11_01]: texture(344),
        [blending.types.TYPE_01_11]: texture(346),
        [blending.types.TYPE_10_11]: texture(353)
    }
};

const generate = (terrainType=terrain.types.GRASS, blendingType=blending.types.TYPE_00_00) =>
    textures[terrainType][blendingType];

module.exports = {
    BYTES_PER_TEXTURE,
    generate
};
