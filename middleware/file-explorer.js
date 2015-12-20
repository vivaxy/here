/**
 * @since 2015-11-20 13:11
 * @author vivaxy
 */
'use strict';

const path = require('path');

const mime = require('mime');
const log = require('log-util');

const readFile = require('../lib/read-file.js');
const readFolder = require('../lib/read-folder.js');
const getFileStat = require('../lib/get-file-stat.js');
const buildFileBrowser = require('../lib/build-file-list.js');
const FALLBACK_CONTENT_TYPE = require('../lib/fallback-content-type.js');

const NOT_FOUNT_INDEX = -1;
const INDEX_PAGE = 'index.html';

module.exports = (absoluteWorkingDirectory) => {

    return function* (next) { // eslint-disable-line max-statements

        // decode for chinese character
        let requestPath = decodeURIComponent(this.request.path); // eslint-disable-line no-invalid-this
        let fullRequestPath = path.join(absoluteWorkingDirectory, requestPath);
        let stat = yield getFileStat(fullRequestPath);

        if (stat.isDirectory()) {

            let files = yield readFolder(fullRequestPath);

            if (files.indexOf(INDEX_PAGE) !== NOT_FOUNT_INDEX) {

                this.redirect(path.join(requestPath, INDEX_PAGE), '/'); // eslint-disable-line no-invalid-this

            } else {

                this.body = buildFileBrowser(files, requestPath, absoluteWorkingDirectory); // eslint-disable-line no-invalid-this, max-len
                this.type = mime.lookup(INDEX_PAGE); // eslint-disable-line no-invalid-this

            }

        } else if (stat.isFile()) {

            this.body = yield readFile(fullRequestPath); // eslint-disable-line no-invalid-this
            let type = mime.lookup(fullRequestPath);

            if (path.extname(fullRequestPath) === '') {

                type = FALLBACK_CONTENT_TYPE;

            }

            this.type = type; // eslint-disable-line no-invalid-this
            log.debug('server :', this.request.method, requestPath, '->', type); // eslint-disable-line no-invalid-this

        }

        yield next;

    };

};
