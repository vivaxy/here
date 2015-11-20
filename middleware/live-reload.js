/**
 * @since 2015-11-20 16:03
 * @author vivaxy
 */
'use strict';
const path = require('path');

const jade = require('jade');

const reloadJavascript = jade.compileFile(path.join(__dirname, '../res/reload.jade'), {
    pretty: '    '
})();

module.exports = function* (next) {

    let socket = this.socket;
    let close = function () {
        socket.removeListener('error', close);
        socket.removeListener('close', close);
    };
    socket.on('connect', () => {
        console.log(argument);
    });
    socket.on('error', close);
    socket.on('close', close);
    
    yield next;
    if (this.type === 'text/html') {
        var resp = '';
        var body = this.body;
        if (~body.indexOf('</head>')) {
            resp = body.replace('</head>', reloadJavascript + '</head>');
        } else {
            resp = data + reloadJavascript;
        }
        this.body = resp;
    }
};
