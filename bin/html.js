/**
 * @since 150205 09:21
 * @author vivaxy
 */

var path = require('path');

var listStyle = 'body' +
    '{' +
    'background:#eee;' +
    'width:100%;' +
    'margin:0;' +
    '}' +

    'a' +
    '{display:block;' +
    '-webkit-tap-highlight-color:rgba(0,0,0,0.1);' +
    'height:48px;' +
    'width:100%;' +
    'text-decoration:none;' +
    'background-color:#fff;' +
    'border-bottom:1px solid #ddd;' +
    'overflow:hidden;' +
    '}' +

    'a span' +
    '{' +
    'display:block;' +
    'height:32px;' +
    'line-height:32px;' +
    'font-size:16px;' +
    'color:#000;' +
    'margin:8px 0 8px 48px;' +
    'overflow:hidden;' +
    'text-overflow:ellipsis;' +
    'white-space:nowrap;' +
    '}' +

    '.html' +
    '{' +
    'color:#3498db;' +
    '}' +

    '.dir' +
    '{' +
    'color:#1abc9c;' +
    '}';


var template = function (files, hostname, port, pathname) {

    files.sort(function (a, b) {
        if (a.indexOf('.') == 0) {
            return 1;
        }
        var _ext_a = path.extname(a);
        var _ext_b = path.extname(b);
        if (_ext_a == _ext_b) {
            // same extension
            return a > b;
            // different
        } else if (_ext_a == '.html') {
            return -1;
        } else if (_ext_b == '.html') {
            return 1;
        } else if (_ext_a == '') {
            return -1;
        } else if (_ext_b == '') {
            return 1;
        }
        return 0;
    });

    var list = files.map(function (file) {
        var _ext = path.extname(file).replace('.', '');
        if (_ext == '') _ext = 'dir';
        return '<a href="http://' + hostname + ':' + port + path.join(pathname, file) + '">' +
            '<span class="' + _ext + '">' +
            file + '</span></a>';
    });
    return '' +
        '<html>' +
        '<head>' +
        '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>' +
        '</head>' +
        '<body>' +
        list.join('') + '' +
        '<style>' + listStyle + '</style>' +
        '</body>' +
        '</html>';
};

module.exports = exports = template;