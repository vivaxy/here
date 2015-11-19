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
 * @param pathname
 * @param directory
 * @returns {*}
 */
var template = function (files, pathname, directory) {
    var baseDir = join(process.cwd(), directory, pathname);
    files = files.filter(function (file) {
        if (file.indexOf('.') === 0) {
            return false;
        }
        // #3 remove inaccessible files from file list
        try {
            if (isWin) {
                fs.statSync(join(baseDir, file));
            } else {
                fs.accessSync(join(baseDir, file), fs.R_OK);
            }
        }
        catch (e) {
            return false;
        }
        return true;
    });
    files.sort(function (a, b) {
        var compare = function (_a, _b) {
            return _a < _b ? -1 :
                _a > _b ? 1 :
                    0;
        };
        var _isDirectoryA = fs.lstatSync(join(baseDir, a)).isDirectory();
        var _isDirectoryB = fs.lstatSync(join(baseDir, b)).isDirectory();
        // order by priority
        if (_isDirectoryA && _isDirectoryB) {
            return compare(a, b);
        }
        if (_isDirectoryA && !_isDirectoryB) {
            return -1;
        }
        if (_isDirectoryB && !_isDirectoryA) {
            return 1;
        }

        var _extensionA = extname(a);
        var _extensionB = extname(b);
        var _isHtmlA = _extensionA === '.html';
        var _isHtmlB = _extensionB === '.html';
        if (_isHtmlA && _isHtmlB) {
            return compare(a, b);
        }
        if (_isHtmlA && !_isHtmlB) {
            return -1;
        }
        if (_isHtmlB && !_isHtmlA) {
            return 1;
        }
        
        if (_extensionA === _extensionB) {
            return compare(a, b);
        }
        
        return compare(a, b);
    });
    
    if (pathname !== '/') {
        files.unshift('..');
    }
    
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
