"use strict";

const fs = require('fs');
const path = require('path');
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

const filterPoint = (point, max) =>
    point.x && point.x < max && 0 < point.y && point.y < max
        ? point
        : null;

const filterPointsByCoordinates = (points, max) =>
    points && points.length
        ? points.filter(point => filterPoint(point, max))
        : [];

const reduceMap = map => ({
    ...map,
    airFields: map.airFields && map.airFields.length
        ? map.airFields.map(airField=>({
            takeoffPoint: filterPoint(airField.takeoffPoint, map.meta.size),
            landingPoint: filterPoint(airField.landingPoint, map.meta.size),
            hangarPoints: filterPointsByCoordinates(airField.hangarPoints, map.meta.size)
        }))
        : [],
    cells: filterPointsByCoordinates(map.cells, map.meta.size),
    flags: filterPointsByCoordinates(map.flags, map.meta.size),
    objects: map.objects && map.objects.constructor === Object
        ? ({
            ...map.objects,
            free: filterPointsByCoordinates(map.objects.free, map.meta.size),
            horizontal: filterPointsByCoordinates(map.objects.horizontal, map.meta.size),
            vertical: filterPointsByCoordinates(map.objects.vertical, map.meta.size),
            trees: filterPointsByCoordinates(map.objects.trees, map.meta.size),
            roads: filterPointsByCoordinates(map.objects.roads, map.meta.size),
            buildings: filterPointsByCoordinates(map.objects.buildings, map.meta.size),
            fences: filterPointsByCoordinates(map.objects.fences, map.meta.size),
            cliff: filterPointsByCoordinates(map.objects.cliff, map.meta.size),
            crates: filterPointsByCoordinates(map.objects.crates, map.meta.size),
            bridges: filterPointsByCoordinates(map.objects.bridges, map.meta.size)
        })
        : null
});

const getMapError = map => {
    if (map.airFields && map.airFields.length > 16) {
        return "The number of aerodromes can not exceed 16";
    }
    if (map.objects) {
        if (map.objects.buildings && map.objects.buildings.length > 800) {
            return "The number of buildings can not exceed 800";
        }
        if (map.objects.bridges && map.objects.bridges.length > 32) {
            return "The number of bridges can not exceed 32";
        }
        let total = 0;
        for (let objectTypeName in map.objects) {
            if (map.objects.hasOwnProperty(objectTypeName)) {
                const items = map.objects[objectTypeName];
                if (items && items.length) {
                    total += items.length;
                }
            }
        }
        if (total > 50000) {
            return "The total number of objects can not exceed 50000";
        }
    }
};

const generateAirFields = map => {
    const arr = map.airFields || [];
    const airFields = require('./airfields');
    const directions = require('./structures/directions');
    let result = airFields.generate();
    for (let i = 0; i < arr.length; i++) {
        if (i < airFields.AIRFIELDS_NUMBER) {
            let airField = arr[i];
            if (airField.takeoffPoint) {
                airFields.setTakeoffPoint(
                    result,
                    i,
                    airField.takeoffPoint.x,
                    airField.takeoffPoint.y,
                    directions[airField.takeoffPoint.direction.toUpperCase()]
                );
            }
            if (airField.landingPoint) {
                airFields.setLandingPoint(
                    result,
                    i,
                    airField.landingPoint.x,
                    airField.landingPoint.y,
                    directions[airField.landingPoint.direction.toUpperCase()]
                );
            }
            if (airField.hangarPoints && airField.hangarPoints.length) {
                for (let j = 0; j < airField.hangarPoints.length; j++) {
                    if (j < airFields.HANGAR_POINT_NUMBER) {
                        let hangar = airField.hangarPoints[j];
                        airFields.setHangarPoint(j)(
                            result,
                            i,
                            hangar.x,
                            hangar.y,
                            directions[hangar.direction.toUpperCase()]
                        );
                    }
                }
            }
        }
    }
    return result;
};

const generateFlags = map => {
    // TODO
    const cFlags = require('./cflags');
    return cFlags.generate(map.meta.size);
};

const generateDesc = map => {
    const desc = require('./desc');
    return desc.generate(map.meta.name);
};

const generateInfo = map => {
    const info = require('./info');
    const schemes = require('./structures/schemes');
    return info.generate(
        schemes[map.meta.scheme.toUpperCase()],
        map.meta.size
    );
};

const generateObjects = map => {
    // TODO
    const objects = require('./objects');
    return objects.generate([]);
};

const generateRhombus = map => {
    // TODO
    const rhombs = require('./rhombs');
    return rhombs.generate(map.meta.size);
};

const generateBinary = map => ({
    airfields: generateAirFields(map),
    cflags: generateFlags(map),
    desc: generateDesc(map),
    info: generateInfo(map),
    objects: generateObjects(map),
    rhombs: generateRhombus(map)
});

const saveBinary = (binary, destination) => {
    for (let key in binary) {
        if (binary.hasOwnProperty(key)) {
            fs.writeFileSync(path.join(destination, key), binary[key]);
        }
    }
};

const generate = ({destination, source}) => {
    if (destination && fs.existsSync(destination)) {
        try {
            const map = reduceMap(getMapInfo(source));
            const mapError = getMapError(map);
            if (mapError) {
                return {
                    code: 1,
                    message: mapError
                }
            } else {
                saveBinary(generateBinary(map), destination);
                return {
                    code: 0,
                    message: `The files successfully saved on "${destination}" directory`
                }
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
