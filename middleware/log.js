/**
 * @since 2016-08-21 10:13
 * @author vivaxy
 */

'use strict';

const log = require('log-util');

const logPrefix = require('../constant/log-prefix');

module.exports = function* (next) {

    const beginTime = new Date().getTime();

    const request = this.request;
    log.verbose(logPrefix.REQUEST, `${request.method} ${request.path}`);

    yield next;

    const endTime = new Date().getTime();

    log.verbose(logPrefix.TIME, `${endTime - beginTime}ms`);

};
