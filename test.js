const fs = require('fs');
const desc = require('./desc.js');

let name = desc.generate('Сало уронили!!!');
fs.writeFileSync('desc', name);