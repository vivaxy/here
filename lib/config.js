/**
 * @since 2015-11-20 15:40
 * @author vivaxy
 */
'use strict';

const config = {
    isDebug: false,

    port: 3000,
    ssl: false,
    directory: '.',
    watch: false,
    silent: false,
    logLevel: 2,
    gzip: false,

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
