/**
 * @since 2015-11-20 13:11
 * @author vivaxy
 */
'use strict';
const fs = require('fs');
const path = require('path');

const mime = require('mime');
const log = require('log-util');

const readFile = require('../lib/read-file.js');
const readFolder = require('../lib/read-folder.js');
const getFileStat = require('../lib/get-file-stat.js');
const buildFileBrowser = require('../lib/build-file-list.js');
const FALLBACK_CONTENT_TYPE = require('../lib/fallback-content-type.js');

const INDEX_PAGE = 'index.html';

module.exports = (absoluteWorkingDirectory) => {
    return function* (next) {
        // decode for chinese character
        let requestPath = decodeURIComponent(this.request.path);
        let fullRequestPath = path.join(absoluteWorkingDirectory, requestPath);
        let stat = yield getFileStat(fullRequestPath);
        if (stat.isDirectory()) {
            let files = yield readFolder(fullRequestPath);
            if (~files.indexOf(INDEX_PAGE)) {
                this.redirect(path.join(requestPath, INDEX_PAGE), '/');
            } else {
                this.body = buildFileBrowser(files, requestPath, absoluteWorkingDirectory);
                this.type = mime.lookup(INDEX_PAGE);
            }
        } else if (stat.isFile()) {
            this.body = yield readFile(fullRequestPath);
            let type = mime.lookup(fullRequestPath);
            if (path.extname(fullRequestPath) === '') {
                type = FALLBACK_CONTENT_TYPE;
            }
            this.type = type;
            log.debug('server :', this.request.method, requestPath, '->', type);
        }
        yield next;
    };
};
