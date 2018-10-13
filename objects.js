"use strict";

const iconv = require('iconv-lite');
const objects = require('./structures/objects');
const props = objects.props;

const generate = (objectsList=[]) =>
    Buffer.from(
        iconv.encode(
            Buffer.from(
                objectsList
                    .map(object=>object.join(' ') + '\n')
                    .join(''), "utf8"
            ),
            "cp1251"
        )
    );

const isObjectLowerThan = (object1, object2) =>
    object2[props.OFFSET_Y] === object1[props.OFFSET_Y] &&
    object2[props.OFFSET_X] < object1[props.OFFSET_X] ||



    object2[props.OFFSET_X] === object1[props.OFFSET_X] &&
    object2[props.OFFSET_Y] === object1[props.OFFSET_Y];

const add = (objectsList=[], object) => {
    if (objectsList.length) {

    } else {
        return objectsList.concat([object]);
    }
};

module.exports = {
    generate
};
