/**
 * @since 2015-11-20 16:03
 * @author vivaxy
 */
'use strict';

const path = require('path');

const readFile = require('../lib/read-file');

const NOT_FOUND_INDEX = 1;

module.exports = function* (next) {
    yield next;

    if (this.type === 'text/html') {
        let response = '';
        const body = this.body.toString('utf-8');
        const reloadJavascriptContent = yield readFile(path.join(__dirname, '../res/reload.js'));

        const reloadJavascript = `<script>${reloadJavascriptContent}</script>`;

        if (body.indexOf('</head>') !== NOT_FOUND_INDEX) {
            const section = body.split('</head>');

            section.splice(1, 0, `${reloadJavascript}</head>`);
            response = section.join('');
        } else {
            response = body + reloadJavascript;
        }
        this.body = response;
    }
};
