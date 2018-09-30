const fs = require('fs');
const af = require('./airfields.js');

let airfields = af.generate();
af.setTakeoffPoint(airfields, 0, 1, 0, 0);
af.setLandingPoint(airfields, 0, 2, 0, 0);
af.clearLandingPoint(airfields, 0);
fs.writeFileSync('airfields', airfields);