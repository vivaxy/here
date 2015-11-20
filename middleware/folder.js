/**
 * @since 2015-11-20 13:11
 * @author vivaxy
 */
'use strict';
const fs = require('fs');
const path = require('path');

const mime = require('mime');
const log = require('log-util');

const buildFileBrowser = require('../lib/build-file-browser.js');

const INDEX_PAGE = 'index.html';

const readFolder = folder => {
    return done=> {
        return fs.readdir(folder, done);
    };
};

module.exports = (workingDirectory) => {
    return function* (next) {
        try {
            yield next;
        } catch (e) {
            if (e.code === 'EISDIR') {
                let requestPath = this.request.path;
                var fullRequestPath = path.join(workingDirectory, requestPath);
                try {
                    let files = yield readFolder(fullRequestPath);
                    if (~files.indexOf(INDEX_PAGE)) {
                        this.redirect(path.join(requestPath, INDEX_PAGE), '/');
                    } else {
                        this.body = buildFileBrowser(files, requestPath, workingDirectory);
                        this.type = mime.lookup(INDEX_PAGE);
                    }
                } catch (err) {
                    throw err;
                }
            } else {
                throw e;
            }
        }
    };
};
