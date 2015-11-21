/**
 * @since 2015-11-20 20:09
 * @author vivaxy
 */
'use strict';

const fs = require('fs');

module.exports = file=> {
    return done => {
        return fs.readFile(file, done);
    };
};
