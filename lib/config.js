/**
 * @since 2015-11-20 15:40
 * @author vivaxy
 */
'use strict';

let config = {
    isDebug: false,

    port: 3000,
    ssl: false,
    directory: '.',
    watch: false,
    silent: false,
    logLevel: 2,

    usageTrackerOwner: 'vivaxy',
    usageTrackerRepo: 'here',
    usageTrackerId: '',

    serveHereVersion: '0.0.0'
};

exports.set = (key, value) => {
    config[key] = value;
    return value;
};

exports.get = (key) => {
    return config[key];
};
