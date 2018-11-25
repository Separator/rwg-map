"use strict";

const blending = require('./structures/blending');
const brightness = require('./structures/brightness');
const sizes = require('./structures/sizes');
const terrain = require('./structures/terrain');
const rhombus = require('./structures/rhombs');

const generateCell = ({
      x=0,
      y=0,
      terrain=terrain.types.GRASS,
      pieces=blending.types.TYPE_00_00,
      brightness=brightness.levels.DEFAULT}) => ({
    x,
    y,
    terrain,
    pieces,
    brightness
});

const concatCells = (cellOne, cellSecond) => {



    return {
        x: + cellOne.x,
        y: + cellOne.y

    };
};

const convertPiecesToBinary = (pieces=[0, 0, 0, 0]) => {

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
            cell = convertCellToBinary(cell);
            arr[cell.x][cell.y] = concatCells(cell, arr[cell.x][cell.y]);
        }
    }
    let result = rhombus.generate(size);
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            let cell = arr[x][y];
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