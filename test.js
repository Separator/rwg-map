/*
const fs = require('fs');
const r = require('./rhombs.js');
const terrain = require('./structures/terrain');
const blending = require('./structures/blending');
const brightness = require('./structures/brightness');

let rhombus = r.generate();

r.setSingleRhombus(rhombus, 0, 0, terrain.SAND, blending.types.TYPE_11_11, 0, 1);
r.setSingleRhombus(rhombus, 1, 0, terrain.SAND, blending.types.TYPE_10_10, 0, 1);
r.setSingleRhombus(rhombus, 0, 1, terrain.SAND, blending.types.TYPE_11_00, 0, 1);
r.setSingleRhombus(rhombus, 1, 1, terrain.SAND, blending.types.TYPE_10_00, 0, 1);

//console.log(rhombus);
fs.writeFileSync('rhombs', rhombus);*/

const fs = require('fs');

const obj = require('./objects.js');

let objects = obj.generate([
    ['most', 0, 256, 50, 0, 179],
    ['most', 0, 288, 50, 0, 179]
]);

fs.writeFileSync('objects', objects);