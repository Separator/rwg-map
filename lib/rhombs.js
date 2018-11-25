"use strict";

const blending = require('./structures/blending');
const brightness = require('./structures/brightness');
const sizes = require('./structures/sizes');
const terrain = require('./structures/terrain');
const rhombus = require('./structures/rhombs');

const generateCell = ({x=0, y=0, terrain="grass", pieces=[0, 0, 0, 0], brightness=brightness.levels.DEFAULT}) => ({
    x,
    y,
    terrain,
    pieces,
    brightness
});

const concatCells = (cellOne, cellSecond) => {

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
    terrain: terrain.getByShortName(cell.terrain),
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
            arr[cell.x][cell.y] = concatCells(cell, arr[cell.x][cell.y]);
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
