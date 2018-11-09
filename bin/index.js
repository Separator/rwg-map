#!/usr/bin/env node

const routines = require('../lib/index');
const validate = require('../lib/utils/validate');

const stopProgram = (err, data, code=1) => {
    console.log(err || data || '');
    process.exit(code);
};

let data = validate({
    'version': ['string', undefined, false],
    'action': ['string', undefined, true],
    'source': ['string', undefined, false],
    'destination': ['string', undefined, false]
});

if (data) {
    if ("version" in data) {
        let packageInfo = require('../package');
        stopProgram(null, packageInfo.version, 0);
    } else {
        if (data.action in routines) {
            let result = routines[data.action](data);
            stopProgram(
                result.code ? result.message : null,
                result.code ? '' : result.message,
                result.code
            );
        } else {
            stopProgram("Parameters are incorrect");
        }
    }
} else {
    stopProgram("Parameters are incorrect");
}