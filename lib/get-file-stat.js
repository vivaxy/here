/**
 * @since 2015-11-23 10:14
 * @author vivaxy
 */

const fs = require('fs');

module.exports = (file) => {
    return (done) => {
        return fs.lstat(file, done);
    };
};
