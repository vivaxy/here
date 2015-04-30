/**
 * @since 150205 09:21
 * @author vivaxy
 */

var path = require('path'),
    fs = require('fs'),
    jade = require('jade'),

    template = function (files, hostname, port, pathname, directory) {

        var baseDir = path.join(process.cwd(), directory, pathname);

        files = files.filter(function (file) {
            return file.indexOf('.') !== 0;
        });

        files.sort(function (a, b) {

            var _ext_a = path.extname(a),
                _ext_b = path.extname(b);

            // order by priority
            if (fs.lstatSync(path.join(baseDir, a)).isDirectory()) {
                return -1;
            }
            if (fs.lstatSync(path.join(baseDir, b)).isDirectory()) {
                return 1;
            }

            if (_ext_a === '.html') {
                return -1;
            }
            if (_ext_b === '.html') {
                return 1;
            }

            if (_ext_a === _ext_b) {
                // same extension
                return a < b ? -1 :
                    a === b ? 0 :
                        -1;
                // different
            }

            return 0;
        });

        if (pathname !== '/') files.unshift('..');

        var list = files.map(function (file) {

            var ext = path.extname(file),
                _ext = 'other';

            if (ext === '.html') _ext = 'html';

            if (fs.lstatSync(path.join(baseDir, file)).isDirectory()) _ext = 'dir';

            if (file === '..') _ext = 'null';

            return {
                href: 'http://' + hostname + ':' + port + path.join(pathname, file),
                className: _ext,
                fileName: file
            };

        });

        return jade.compileFile('./jade/list.jade', {
            pretty: '    '
        })({
            list: list
        });
    };

module.exports = template;
