const fs = require('fs');
const r = require('./rhombs.js');
const terrain = require('./structures/terrain');
const blending = require('./structures/blending');

let rhombus = r.generate();

r.setSingleRhombus(rhombus, 0, 0, terrain.SAND, blending.types.TYPE_11_11, 0, 1);
r.setSingleRhombus(rhombus, 1, 0, terrain.SAND, blending.types.TYPE_10_10, 0, 1);
r.setSingleRhombus(rhombus, 0, 1, terrain.SAND, blending.types.TYPE_11_00, 0, 1);
r.setSingleRhombus(rhombus, 1, 1, terrain.SAND, blending.types.TYPE_10_00, 0, 1);

fs.writeFileSync('rhombs', rhombus);