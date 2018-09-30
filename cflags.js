"use strict";

const sizes = require('./structures/sizes');
const BYTES_PER_POSITION = 2;

const ENTITIES = {
    WITHOUT_PONTOONS: Buffer.from([0x80, 0x00]),            // ‭1000 0000 0000 0000
    WITHOUT_WAVES: Buffer.from([0x40, 0x00]),               // 0100 0000 0000 0000
    VISIBILITY_UP: Buffer.from([0x20, 0x00]),               // 0010 0000 0000 0000
    VISIBILITY_DOWN: Buffer.from([0x10, 0x00]),             // 0001 0000 0000 0000
    TERRITORY: Buffer.from([0x00, 0x02]),                   // 0000 0000 0000 0010
    OBSTRUCTION: [
        Buffer.from([0x01, 0x00]),                          // 0000 0001 0000 0000
        Buffer.from([0x02, 0x00]),                          // 0000 0010 0000 0000
        Buffer.from([0x04, 0x00]),                          // 0000 0100 0000 0000
        Buffer.from([0x08, 0x00]),                          // 0000 1000 0000 0000
    ],
    COMPLETE_OBSTRUCTION: Buffer.from([0x00, 0x40]),        // 0000 0000 0100 0000
    MOWERS: [
        Buffer.from([0x00, 0x04]),                          // 0000 0000 0000 0100
        Buffer.from([0x00, 0x08]),                          // 0000 0000 0000 1000
        Buffer.from([0x00, 0x10]),                          // 0000 0000 0001 0000
        Buffer.from([0x00, 0x20]),                          // 0000 0000 0010 0000
    ]
};

const generate = (size=sizes.SMALL) =>
    Buffer.alloc(size * size * BYTES_PER_POSITION);

const setPosition = (cFlags, position, parameter) => {
    let offset = position * BYTES_PER_POSITION;
    for (let i = 0; i < parameter.length; i++) {
        cFlags[offset + i] = cFlags[offset + i] | parameter[i];
    }
    return cFlags;
};

const clearPosition = (cFlags, position, parameter) => {
    let offset = position * BYTES_PER_POSITION;
    for (let i = 0; i < parameter.length; i++) {
        cFlags[offset + i] = cFlags[offset + i] & (~parameter[i]);
    }
};

const setWithoutPontoons = (cFlags, position) =>
    setPosition(cFlags, position, ENTITIES.WITHOUT_PONTOONS);

const clearWithoutPontoons = (cFlags, position) =>
    clearPosition(cFlags, position, ENTITIES.WITHOUT_PONTOONS);

const setWithoutWaves = (cFlags, position) =>
    setPosition(cFlags, position, ENTITIES.WITHOUT_WAVES);

const clearWithoutWaves = (cFlags, position) =>
    clearPosition(cFlags, position, ENTITIES.WITHOUT_WAVES);

const setAirFieldTerritory = (cFlags, position) =>
    setPosition(cFlags, position, ENTITIES.TERRITORY);

const clearAirFieldTerritory = (cFlags, position) =>
    clearPosition(cFlags, position, ENTITIES.TERRITORY);

const setObstruction = (cFlags, position, subPosition) =>
    setPosition(cFlags, position, ENTITIES.OBSTRUCTION[subPosition]);

const clearObstruction = (cFlags, position, subPosition) =>
    clearPosition(cFlags, position, ENTITIES.OBSTRUCTION[subPosition]);

const setCompleteObstruction = (cFlags, position) =>
    setPosition(cFlags, position, ENTITIES.COMPLETE_OBSTRUCTION);

const clearCompleteObstruction = (cFlags, position) =>
    clearPosition(cFlags, position, ENTITIES.COMPLETE_OBSTRUCTION);

const setMowers = (cFlags, position, subPosition) =>
    setPosition(cFlags, position, ENTITIES.MOWERS[subPosition]);

const clearMowers = (cFlags, position, subPosition) =>
    clearPosition(cFlags, position, ENTITIES.MOWERS[subPosition]);

const setVisibilityUp = (cFlags, position) =>
    setPosition(cFlags, position, ENTITIES.VISIBILITY_UP);

const clearVisibilityUp = (cFlags, position) =>
    clearPosition(cFlags, position, ENTITIES.VISIBILITY_UP);

const setVisibilityDown = (cFlags, position) =>
    setPosition(cFlags, position, ENTITIES.VISIBILITY_DOWN);

const clearVisibilityDown = (cFlags, position) =>
    clearPosition(cFlags, position, ENTITIES.VISIBILITY_DOWN);

module.exports = {
    generate,
    setWithoutPontoons,
    clearWithoutPontoons,
    setWithoutWaves,
    clearWithoutWaves,
    setAirFieldTerritory,
    clearAirFieldTerritory,
    setObstruction,
    clearObstruction,
    setCompleteObstruction,
    clearCompleteObstruction,
    setMowers,
    clearMowers,
    setVisibilityUp,
    clearVisibilityUp,
    setVisibilityDown,
    clearVisibilityDown
};
