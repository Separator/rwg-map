"use strict";

const validate = require('./utils/validate').validate;

const stopProgram = (err, data, code=1) => {
    console.log(err || data || '');
    process.exit(code);
};


const generate = ({source, destination}) => {

};

if (module.parent) {
    module.exports = generate;
} else {
    let data = validate({
        'source': ['string', undefined, true],
        'destination': ['string', undefined, true]
    });
    if (data) {
        stopProgram(null, data, 0);
    } else {
        stopProgram("Parameters are incorrect");
    }
}
