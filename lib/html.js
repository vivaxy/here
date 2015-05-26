/**
 * @since 150205 09:21
 * @author vivaxy
 */

var fs = require('fs'),
    jade = require('jade'),
    path = require('path'),
    
    join = path.join,
    extname = path.extname,

    template = function (files, hostname, port, pathname, directory) {
        var baseDir = join(process.cwd(), directory, pathname);
        files = files.filter(function (file) {
            return file.indexOf('.') !== 0;
        });
        files.sort(function (a, b) {
            var _ext_a = extname(a),
                _ext_b = extname(b);
            // order by priority
            if (fs.lstatSync(join(baseDir, a)).isDirectory()) {
                return -1;
            }
            if (fs.lstatSync(join(baseDir, b)).isDirectory()) {
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
            var ext = extname(file),
                _ext = 'other';
            if (ext === '.html') _ext = 'html';
            if (fs.lstatSync(join(baseDir, file)).isDirectory()) _ext = 'dir';
            if (file === '..') _ext = 'null';
            return {
                href: 'http://' + hostname + ':' + port + join(pathname, file),
                className: _ext,
                fileName: file
            };
        });
        return jade.compileFile(join(__dirname, '../res/list.jade'), {
            pretty: '    '
        })({
            list: list
        });
    };

module.exports = template;
