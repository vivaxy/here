/**
 * @since 2015-11-20 13:11
 * @author vivaxy
 */
'use strict';

const FALLBACK_CONTENT_TYPE = require('../lib/fallback-content-type');

module.exports = function* (next) {
    try {
        yield next;
    } catch (e) {
        this.status = 404;
        this.body = e.stack;
        this.type = FALLBACK_CONTENT_TYPE;
    }
};
