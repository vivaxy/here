/**
 * @since 2015-11-20 13:11
 * @author vivaxy
 */

const path = require('path');

const mime = require('mime');
const log = require('log-util');

const configKeys = require('../constant/config.js');
const logPrefix = require('../constant/log-prefix.js');

const config = require('../lib/config.js');
const readFile = require('../lib/read-file.js');
const readFolder = require('../lib/read-folder.js');
const getFileStat = require('../lib/get-file-stat.js');
const buildFileBrowser = require('../lib/build-file-list.js');
const FALLBACK_CONTENT_TYPE = require('../lib/fallback-content-type.js');

const NOT_FOUNT_INDEX = -1;
const INDEX_PAGE = 'index.html';

module.exports = function* (next) {
    const directory = config.get(configKeys.DIRECTORY);

    // decode for chinese character
    const requestPath = decodeURIComponent(this.request.path);
    const fullRequestPath = path.join(directory, requestPath);
    // fix security issue
    if (!fullRequestPath.startsWith(directory)) {
        return yield next;
    }
    const stat = yield getFileStat(fullRequestPath);

    if (stat.isDirectory()) {
        const files = yield readFolder(fullRequestPath);

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
