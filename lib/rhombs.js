"use strict";

const blending = require('./structures/blending');
const brightness = require('./structures/brightness');
const sizes = require('./structures/sizes');
const terrain = require('./structures/terrain');
const rhombus = require('./structures/rhombs');

const generateCell = ({x=0, y=0, terrainType, pieces=[0, 0, 0, 0], brightness=brightness.levels.DEFAULT}) => ({
    x,
    y,
    terrain: terrain.getByShortName(terrainType),
    pieces,
    brightness
});

const clickToCell = (arr, x, y, offset, terrainType) => {
    let target = arr[x][y];
    if (target.terrain === terrainType) {
        target.pieces[offset] = terrainType === terrain.types.GRASS ? 0 : 1;
    } else {
        if (target.terrain === terrain.types.GRASS) {
            target.terrain = terrainType;
            target.pieces = [0, 0, 0, 0];
            target.pieces[offset] = 1;
        } else {
            if (terrainType === terrain.types.GRASS ){
                target.pieces[offset] = 0;
                let piecesLength = target.pieces.reduce((rs, item) => item > 0 ? rs+1 : rs, 0);
                if (piecesLength === 0) {
                    target.terrain = terrain.types.GRASS;
                } else if (piecesLength === 2) {
                    if (target.pieces[0] && target.pieces[3]) {
                        target.pieces[3] = 0;
                    } else if (target.pieces[1] && target.pieces[2]) {
                        target.pieces[2] = 0;
                    }
                }
            } else {
                target.terrain = terrainType;
                target.pieces = [0, 0, 0, 0];
                target.pieces[offset] = 1;
            }
        }
    }

};

const concatCells = (arr, cell) => {
    let x = cell.x;
    let y = cell.y;
    let terrainType = terrain.getByShortName(cell.terrain);
    if (cell.pieces[0]) {
        clickToCell(arr, x, y, 0, terrainType);
        if (x - 1 >= 0)
            clickToCell(arr, x - 1, y, 0, terrainType);
        if (y - 1 >= 0)
            clickToCell(arr, x, y - 1, 0, terrainType);
        if (x - 1 >= 0 && y - 1 >= 0)
            clickToCell(arr, x - 1, y - 1, 0, terrainType);
    }
    if (cell.pieces[1]) {
        clickToCell(arr, x, y, 1, terrainType);
        if (x + 1 < arr.length)
            clickToCell(arr, x + 1, y, 1, terrainType);
        if (y - 1 >= 0)
            clickToCell(arr, x, y - 1, 1, terrainType);
        if (x + 1 < arr.length && y - 1 >= 0)
            clickToCell(arr, x + 1, y - 1, 1, terrainType);
    }
    if (cell.pieces[2]) {
        clickToCell(arr, x, y, 2, terrainType);
        if (x - 1 >= 0)
            clickToCell(arr, x - 1, y, 2, terrainType);
        if (y + 1 < arr.length)
            clickToCell(arr, x, y + 1, 2, terrainType);
        if (x - 1 >= 0 && y + 1 < arr.length)
            clickToCell(arr, x - 1, y + 1, 2, terrainType);
    }
    if (cell.pieces[3]) {
        clickToCell(arr, x, y, 3, terrainType);
        if (x + 1 < arr.length)
            clickToCell(arr, x + 1, y, 3, terrainType);
        if (y + 1 < arr.length)
            clickToCell(arr, x, y + 1, 3, terrainType);
        if (x + 1 < arr.length && y + 1 < arr.length)
            clickToCell(arr, x + 1, y + 1, 3, terrainType);
    }
    return arr;
};

const convertPiecesToBinary = pieces => {
    let result = 0;
    if (pieces && pieces.constructor === Array) {
        if (pieces[0]) result |= blending.positions.TOP_LEFT;
        if (pieces[1]) result |= blending.positions.TOP_RIGHT;
        if (pieces[2]) result |= blending.positions.BOTTOM_LEFT;
        if (pieces[3]) result |= blending.positions.BOTTOM_RIGHT;
    }
    return blending.mutationKeys[result];
};

const convertCellToBinary = cell => ({
    ...cell,
    pieces: convertPiecesToBinary(cell.pieces)
});

const generateMapArray = (size) => {
    let result = [];
    for (let x = 0; x < size; x++) {
        result[x] = [];
        for ( let y = 0; y < size; y++) {
            result[x].push(generateCell({x, y}));
        }
    }
    return result;
};

const generate = (size=sizes.SMALL, cells=[]) => {
    let arr = generateMapArray(size);
    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i];
        if (arr[cell.x] && arr[cell.x][cell.y]) {
            arr = concatCells(arr, cell);
        }
    }
    let result = rhombus.generate(size);
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            let cell = convertCellToBinary(arr[x][y]);
            rhombus.setRhombusProps(
                result,
                cell.x,
                cell.y,
                cell.terrain,
                cell.pieces,
                cell.brightness
            );
        }
    }
    return result;
};

module.exports = {
    generate
};
