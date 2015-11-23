/**
 * @since 150205 09:21
 * @author vivaxy
 */
'use strict';

const fs = require('fs');
const path = require('path');

const jade = require('jade');

const join = path.join;
const extname = path.extname;
const isWindows = /^win/.test(process.platform);

const compare = (_a, _b) => {
    return _a < _b ? -1 :
        _a > _b ? 1 :
            0;
};

/**
 *
 * @param files
 * @param pathname
 * @param absoluteWorkingDirectory
 * @returns {String}
 */
module.exports = (files, pathname, absoluteWorkingDirectory) => {

    const baseDir = join(absoluteWorkingDirectory, pathname);

    files = files.filter((file) => {
        if (file.indexOf('.') === 0) {
            return false;
        }
        // #3 remove inaccessible files from file list
        // win下access任何文件都会返回可访问
        try {
            if (isWindows) {
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
    files.sort((a, b) => {

        let _isDirectoryA = fs.lstatSync(join(baseDir, a)).isDirectory();
        let _isDirectoryB = fs.lstatSync(join(baseDir, b)).isDirectory();
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

        let _extensionA = extname(a);
        let _extensionB = extname(b);
        let _isHtmlA = _extensionA === '.html';
        let _isHtmlB = _extensionB === '.html';
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

    let list = files.map((file) => {
        let ext = extname(file);
        let _ext = 'other';
        if (ext === '.html') {
            _ext = 'html';
        }
        if (fs.lstatSync(join(baseDir, file)).isDirectory()) {
            _ext = 'dir';
        }
        if (file === '..') {
            _ext = 'null';
        }
        return {
            // remove http://ip:port to redirect to correct ip:port
            href: join(pathname, file),
            className: _ext,
            fileName: file
        };
    });

    return jade.compileFile(
        join(__dirname, '../res/list.jade'),
        {
            pretty: '    '
        }
    )(
        {
            list: list
        }
    );
};
