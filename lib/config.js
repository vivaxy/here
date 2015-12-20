/**
 * @since 2015-11-20 15:40
 * @author vivaxy
 */
'use strict';

let config = {
    isDebug: false
};

exports.set = (key, value) => {
    config[key] = value;
    return value;
};

exports.get = (key) => {
    return config[key];
};
