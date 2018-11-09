"use strict";

const iconv = require('iconv-lite');

const generate = text =>
    Buffer.from(iconv.encode(Buffer.from(text, "utf8"), "cp1251"));

module.exports = {
    generate
};