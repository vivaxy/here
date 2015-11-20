/**
 * @since 2015-11-20 13:11
 * @author vivaxy
 */
'use strict';
const fs = require('fs');
const path = require('path');

const mime = require('mime');
const log = require('log-util');

const FALLBACK_CONTENT_TYPE = require('../lib/fallback-content-type.js');

const readFile = file=> {
    return done => {
        return fs.readFile(file, done);
    };
};

module.exports = (workingDirectory) => {
    return function* () {
        let requestPath = this.request.path;
        var fullRequestPath = path.join(workingDirectory, requestPath);
        this.body = yield readFile(fullRequestPath);
        let type = mime.lookup(fullRequestPath);
        if (path.extname(fullRequestPath) === '') {
            type = FALLBACK_CONTENT_TYPE;
        }
        this.type = type;
        log.debug('server : ', this.request.method, requestPath, type);
    };
};
