"use strict";

const fs = require('fs');
const merge = require('deepmerge');
const toInteger = require('to-integer');

const setOffsetToPoint = (point, offsetX, offsetY) =>
    point && point.constructor === Object
        ? ({
            ...point,
            x: toInteger(point.x) + offsetX,
            y: toInteger(point.y) + offsetY
        })
        : null;

const setOffsetToPointsArray = (arr, offsetX, offsetY) =>
    arr && arr.length
        ? arr.map(item=>setOffsetToPoint(item, offsetX, offsetY))
        : [];

const applyOffset = (map, offsetX=0, offsetY=0) => ({
    ...map,
    airFields: map.airFields && map.airFields.length
        ? map.airFields.map(airField=>({
            takeoffPoint: setOffsetToPoint(airField.takeoffPoint, offsetX, offsetY),
            landingPoint: setOffsetToPoint(airField.landingPoint, offsetX, offsetY),
            hangarPoints: setOffsetToPointsArray(airField.hangarPoints, offsetX, offsetY)
        }))
        : [],
    cells: setOffsetToPointsArray(map.cells, offsetX, offsetY),
    embeddings: setOffsetToPointsArray(map.embeddings, offsetX, offsetY),
    flags: setOffsetToPointsArray(map.flags, offsetX, offsetY),
    objects: map.objects && map.objects.constructor === Object
        ? ({
            ...map.objects,
            free: setOffsetToPointsArray(map.objects.free, offsetX, offsetY),
            horizontal: setOffsetToPointsArray(map.objects.horizontal, offsetX, offsetY),
            vertical: setOffsetToPointsArray(map.objects.vertical, offsetX, offsetY),
            trees: setOffsetToPointsArray(map.objects.trees, offsetX, offsetY),
            roads: setOffsetToPointsArray(map.objects.roads, offsetX, offsetY),
            buildings: setOffsetToPointsArray(map.objects.buildings, offsetX, offsetY),
            fences: setOffsetToPointsArray(map.objects.fences, offsetX, offsetY),
            cliff: setOffsetToPointsArray(map.objects.cliff, offsetX, offsetY),
            crates: setOffsetToPointsArray(map.objects.crates, offsetX, offsetY),
            bridges: setOffsetToPointsArray(map.objects.bridges, offsetX, offsetY)
        })
        : null
});

const getMapInfo = (path, result={}, offsetX=0, offsetY=0) => {
    if (fs.existsSync(path)) {
        let map = JSON.parse(fs.readFileSync(path, 'utf8'));
        if (map && map.constructor === Object) {
            if (offsetX || offsetY) {
                map = applyOffset(map, offsetX, offsetY);
            }
            if ('embeddings' in map) {
                for (let i = 0; i < map.embeddings.length; i++) {
                    let embedding = map.embeddings[i];
                    map = getMapInfo(embedding.path, map, embedding.x, embedding.y);
                }
            }
            return merge(result, {
                ...map,
                embeddings: [],
                meta: result.meta || map.meta
            });
        } else {
            throw new Error(`File "${path}" has incorrect syntax`);
        }
    } else {
        throw new Error(`File "${path}" is not exists`);
    }
};

const generate = ({destination, source}) => {
    if (destination && fs.existsSync(destination)) {
        try {
            const map = getMapInfo(source);
            return {
                code: 0,
                message: JSON.stringify(map, null, 4)
            }
        } catch (e) {
            return {
                code: 1,
                message: e.message
            }
        }
    } else {
        return {
            code: 1,
            message: 'Destination not exists'
        }
    }
};

module.exports = {
    generate
};
