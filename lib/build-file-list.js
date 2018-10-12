/**
 * @since 150205 09:21
 * @author vivaxy
 */

const fs = require('fs');
const path = require('path');

const pug = require('pug');

const join = path.join;
const extname = path.extname;
const isWindows = /^win/.test(process.platform);

const AHEAD = -1;
const ABACK = 1;
const STILL = 0;
const HTML_EXTENSION = '.html';

/**
 *
 * @param {String} _a fileName
 * @param {String} _b fileName
 * @returns {number} sort value
 */
const compare = (_a, _b) => {
  if (_a < _b) {
    return AHEAD;
  } else if (_a > _b) {
    return ABACK;
  }
  return STILL;
};

/**
 *
 * @param {Array} files folder file list
 * @param {String} pathname folder absolute path
 * @param {String} absoluteWorkingDirectory absolute root directory
 * @returns {String} html content
 */
module.exports = (files, pathname, absoluteWorkingDirectory) => {
  const baseDir = join(absoluteWorkingDirectory, pathname);

  const filesFiltered = files.filter((file) => {
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
    } catch (e) {
      return false;
    }
    return true;
  });

  filesFiltered.sort((a, b) => {
    const _isDirectoryA = fs.lstatSync(join(baseDir, a)).isDirectory();
    const _isDirectoryB = fs.lstatSync(join(baseDir, b)).isDirectory();
    // order by priority
    if (_isDirectoryA && _isDirectoryB) {
      return compare(a, b);
    }
    if (_isDirectoryA && !_isDirectoryB) {
      return AHEAD;
    }
    if (_isDirectoryB && !_isDirectoryA) {
      return ABACK;
    }
    const _extensionA = extname(a);
    const _extensionB = extname(b);
    const _isHtmlA = _extensionA === HTML_EXTENSION;
    const _isHtmlB = _extensionB === HTML_EXTENSION;
    if (_isHtmlA && _isHtmlB) {
      return compare(a, b);
    }
    if (_isHtmlA && !_isHtmlB) {
      return AHEAD;
    }
    if (_isHtmlB && !_isHtmlA) {
      return ABACK;
    }
    if (_extensionA === _extensionB) {
      return compare(a, b);
    }
    return compare(a, b);
  });

  if (pathname !== '/') {
    filesFiltered.unshift('..');
  }

  const list = filesFiltered.map((file) => {
    const ext = extname(file);
    let _ext = 'other';
    if (ext === HTML_EXTENSION) {
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
      fileName: file,
    };
  });

  return pug.compileFile(join(__dirname, '../res/list.pug'), {
    pretty: '    ',
  })({ list });
};
