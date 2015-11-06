/**
 * @since 150205 09:21
 * @author vivaxy
 */

var fs = require('fs');
var path = require('path');

var jade = require('jade');

var join = path.join;
var extname = path.extname;
var isWin = /^win/.test(process.platform);

/**
 *
 * @param files
 * @param port
 * @param pathname
 * @param directory
 * @returns {*}
 */
var template = function (files, port, pathname, directory) {
    var baseDir = join(process.cwd(), directory, pathname);
    files = files.filter(function (file) {
        if (file.indexOf('.') === 0) {
            return false;
        }
        // #3 remove inaccessible files from file list
        try {
            if (isWin) {
                fs.statSync(join(baseDir, file));
            }
            else {
                fs.accessSync(join(baseDir, file), fs.R_OK);
            }
        }
        catch (e) {
            return false;
        }

        return true;
    });
    files.sort(function (a, b) {
        var _ext_a = extname(a);
        var _ext_b = extname(b);
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
        var ext = extname(file);
        var _ext = 'other';
        if (ext === '.html') _ext = 'html';
        if (fs.lstatSync(join(baseDir, file)).isDirectory()) _ext = 'dir';
        if (file === '..') _ext = 'null';
        return {
            // remove http://ip:port to redirect to correct ip:port
            href: join(pathname, file),
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
