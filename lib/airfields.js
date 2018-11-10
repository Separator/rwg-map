"use strict";

const directions = require('./structures/directions');
const coordinates = require('./structures/coordinates');

const BYTES_PER_RECORD = coordinates.BYTES_PER_BIG_COORDINATE;
const COORDINATE_X_RECORD__NUMBER = 1;
const COORDINATE_Y_RECORD_NUMBER = 1;
const DIRECTION_RECORD_NUMBER = 1;
const BYTES_PER_POINT =
    BYTES_PER_RECORD * (COORDINATE_X_RECORD__NUMBER + COORDINATE_Y_RECORD_NUMBER + DIRECTION_RECORD_NUMBER);

const TAKEOFF_POINT_NUMBER = 1;
const LANDING_POINT_NUMBER = 1;
const HANGAR_POINT_NUMBER = 16;
const BYTES_PER_AIRFIELD =
    BYTES_PER_POINT * (TAKEOFF_POINT_NUMBER + LANDING_POINT_NUMBER + HANGAR_POINT_NUMBER);
const AIRFIELDS_NUMBER = 16;

const TAKEOFF_POINT_X_OFFSET = 0;
const TAKEOFF_POINT_Y_OFFSET = TAKEOFF_POINT_X_OFFSET + BYTES_PER_RECORD;
const TAKEOFF_POINT_DIRECTION_OFFSET = TAKEOFF_POINT_Y_OFFSET + BYTES_PER_RECORD;
const LANDING_POINT_X_OFFSET = TAKEOFF_POINT_DIRECTION_OFFSET + BYTES_PER_RECORD;
const LANDING_POINT_Y_OFFSET = LANDING_POINT_X_OFFSET + BYTES_PER_RECORD;
const LANDING_POINT_DIRECTION_OFFSET = LANDING_POINT_Y_OFFSET + BYTES_PER_RECORD;
const HANGARS_ARRAY_OFFSET = LANDING_POINT_DIRECTION_OFFSET + BYTES_PER_RECORD;

const generate = () =>
    Buffer.alloc(BYTES_PER_AIRFIELD * AIRFIELDS_NUMBER);

const setPoint = offset => (airfields, airFieldIndex, offsetX, offsetY, direction) =>
    airfields.fill(
        Buffer.concat([
            coordinates.generate(offsetX),
            coordinates.generate(offsetY),
            directions.generate(direction)
        ]),
        airFieldIndex * BYTES_PER_AIRFIELD + offset,
        airFieldIndex * BYTES_PER_AIRFIELD + offset + BYTES_PER_POINT
    );

const clearPoint = offset => (airfields, airFieldIndex) =>
    airfields.fill(
        Buffer.alloc(BYTES_PER_POINT),
        airFieldIndex * BYTES_PER_AIRFIELD + offset,
        airFieldIndex * BYTES_PER_AIRFIELD + offset + BYTES_PER_POINT
    );

const setTakeoffPoint = setPoint(TAKEOFF_POINT_X_OFFSET);
const clearTakeoffPoint = clearPoint(TAKEOFF_POINT_X_OFFSET);

const setLandingPoint = setPoint(LANDING_POINT_X_OFFSET);
const clearLandingPoint = clearPoint(LANDING_POINT_X_OFFSET);

const setHangarPoint = hangarIndex =>
    setPoint(HANGARS_ARRAY_OFFSET + hangarIndex * BYTES_PER_POINT);
const clearHangarPoint = hangarIndex =>
    clearPoint(HANGARS_ARRAY_OFFSET + hangarIndex * BYTES_PER_POINT);

module.exports = {
    AIRFIELDS_NUMBER,
    HANGAR_POINT_NUMBER,
    generate,
    setTakeoffPoint,
    clearTakeoffPoint,
    setLandingPoint,
    clearLandingPoint,
    setHangarPoint,
    clearHangarPoint
};