/**
 * @since 2015-11-19 20:15
 * @author vivaxy
 */
'use strict';

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const ip = require('ip');
const koa = require('koa');
const jade = require('jade');
const mime = require('mime');

const buildFileBrowser = require('./build-file-browser.js');

const app = koa();
const cwd = process.cwd();
const exec = childProcess.exec;

const INDEX_PAGE = 'index.html';

app.use(function* (next) {
    let requestPath = this.request.path;
    var fullRequestPath = path.join(cwd, requestPath);
    return yield function (done) {
        return fs.readFile(fullRequestPath, (err, fileContent) => {
            if (err) {
                if (err.code === 'EISDIR') {
                    // request a folder
                    // read files
                    return fs.readdir(fullRequestPath, (e, files) => {
                        if (e) {
                            this.status = 404;
                            this.body = e;
                            return done();
                        } else {
                            // redirect if index.html found
                            if (~files.indexOf(INDEX_PAGE)) {
                                this.redirect(path.join(requestPath, INDEX_PAGE), '/');
                                return done();
                                //_this._redirect(res, join(pathname, 'index.html'));
                            } else {
                                //list folder
                                this.body = buildFileBrowser(files, requestPath, './');
                                this.type = mime.lookup(INDEX_PAGE);
                                return done();
                            }
                        }
                    });
                } else {
                    this.status = 404;
                    this.body = err;
                    return done();
                }
            } else {
                this.body = fileContent;
                this.type = mime.lookup(fullRequestPath);
                if (path.extname(fullRequestPath) === '') {
                    this.type = 'application/json';
                }
                return done();
            }
        });
    };
});

let port = 3000;
let start = function () {
    return app.listen(port, function () {
        // success
        // always use current ip address
        var openUrl = 'http://' + ip.address() + ':' + port + '/';
        var execCommand = process.platform === 'darwin' ?
            'open' : process.platform === 'win32' ?
            'start' : 'xdg-open';
        exec(execCommand + ' ' + openUrl);
    }).on('error', function (err) {
        if (err.code === 'EADDRINUSE') {
            // red
            console.log('server : port ' + port + ' in use');
            port++;
            return start();
        }
    });
};

module.exports = start;
