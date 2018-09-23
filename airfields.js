"use strict";

const sizes = require('./sizes');
const BYTES_PER_AIRFIELD = 216;
const MAX_AIRFIELDS_NUM = 16;

// 16 аэродромов всего
// 216 байт на аэродром

// точка взлёта:
// 0x00, 0x01 - смещение по x;
// 0x04, 0x05 - смещение по y;
// 0x08 - направление (0x00 - восток, 0x01 - юг, 0x02 - запад, 0x03 - север)

// точка посадки:
// 0x0c, 0x0d - смещение по x;
// 0x10, 0x11 - смещение по y;
// 0x14 - направление (0x00 - восток, 0x01 - юг, 0x02 - запад, 0x03 - север)

// Ангары:
// 16 ангаров всего
// 16 точек на ангар

// Первая клетка 1го ангара:
// 0x18, 0x19 - смещение по x;
// 0x1c, 0x1d - смещение по y;
// 0x20 - направление (0x00 - восток, 0x01 - юг, 0x02 - запад, 0x03 - север)

// Вторая клетка 1го ангара:
// 0x24, 0x25 - смещение по x;
// 0x28, 0x29 - смещение по y;
// 0x2c - направление (0x00 - восток, 0x01 - юг, 0x02 - запад, 0x03 - север)
// => 12 байт на клетку

const generateAirfield = () =>
    Buffer.alloc(BYTES_PER_AIRFIELD);

const generate = () =>
    Buffer.concat([...new Array(MAX_AIRFIELDS_NUM)].map(() => generateAirfield()));

const setPosition = (airfields, position, airfield) => {
    let offset = position * BYTES_PER_AIRFIELD;
    for (let i = 0; i < airfield.length; i++) {
        airfields[offset + i] = airfield[i];
    }
    return airfields;
};

const clearAirfield = (airfields, index) =>
    setPosition(airfields, index, generateAirfield());

const setTakeoffPoint =(airfields, position, mapSize=sizes.SMALL, )


module.exports = {
    generate,
    clearAirfield
};