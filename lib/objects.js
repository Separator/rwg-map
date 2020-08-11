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

const find = (objectsList, object1) =>
    objectsList.findIndex(object2 =>
        object1[props.TYPE] === object2[props.TYPE] &&
        object1[props.OFFSET_X] === object2[props.OFFSET_X] &&
        object1[props.OFFSET_Y] === object2[props.OFFSET_Y]
    );

const remove = (objectsList, object1) =>
    objectsList.filter(object2 =>
        object1[props.TYPE] !== object2[props.TYPE] ||
        object1[props.OFFSET_X] !== object2[props.OFFSET_X] ||
        object1[props.OFFSET_Y] !== object2[props.OFFSET_Y]
    );

const isObjectLowerThan = (object1, object2) =>
    object2[props.OFFSET_Y]  <  object1[props.OFFSET_Y] ||
    object2[props.OFFSET_Y] === object1[props.OFFSET_Y] &&
    object2[props.OFFSET_X]  <  object1[props.OFFSET_X];

const add = (objectsList=[], object1) => {
    let objectIndex = find(objectsList, object1);
    if (objectIndex !== -1) {
        objectsList = remove(objectsList, object1);
    }
    if (objectsList.length) {
        let buff = [...objectsList].reverse();
        let index = buff.findIndex(object2 =>
            isObjectLowerThan(object1, object2)
        );
        if (index === -1) {
            return [object1, ...objectsList];
        } else {
            buff.splice(index, 0, object1);
            return [...buff].reverse();
        }
    } else {
        return [object1];
    }
};

module.exports = {
    generate,
    add,
    remove
};
