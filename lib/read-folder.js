/**
 * @since 2015-11-23 10:13
 * @author vivaxy
 */
'use strict';

const fs = require('fs');

module.exports = file => {
    return done=> {
        return fs.readdir(file, done);
    };
};
