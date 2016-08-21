/**
 * @since 2015-11-20 13:11
 * @author vivaxy
 */
'use strict';

const path = require('path');

const mime = require('mime');
const log = require('log-util');

const configKey = require('../constant/config');
const logPrefix = require('../constant/log-prefix');

const config = require('../lib/config');
const readFile = require('../lib/read-file');
const readFolder = require('../lib/read-folder');
const getFileStat = require('../lib/get-file-stat');
const buildFileBrowser = require('../lib/build-file-list');
const FALLBACK_CONTENT_TYPE = require('../lib/fallback-content-type');

const NOT_FOUNT_INDEX = -1;
const INDEX_PAGE = 'index.html';

module.exports = function* (next) {

    const directory = config.get(configKey.DIRECTORY);

    // decode for chinese character
    let requestPath = decodeURIComponent(this.request.path);
    let fullRequestPath = path.join(directory, requestPath);
    let stat = yield getFileStat(fullRequestPath);

    if (stat.isDirectory()) {

        let files = yield readFolder(fullRequestPath);

        if (files.indexOf(INDEX_PAGE) !== NOT_FOUNT_INDEX) {

            this.redirect(path.join(requestPath, INDEX_PAGE), '/');

        } else {

            this.body = buildFileBrowser(files, requestPath, directory);
            this.type = mime.lookup(INDEX_PAGE);

        }

    } else if (stat.isFile()) {

        this.body = yield readFile(fullRequestPath);
        let type = mime.lookup(fullRequestPath);

        if (path.extname(fullRequestPath) === '') {

            type = FALLBACK_CONTENT_TYPE;

        }

        this.type = type;
        log.verbose(logPrefix.RESPONSE, this.request.method, requestPath, 'as', type);

    }

    yield next;

};
