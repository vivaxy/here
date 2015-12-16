/**
 * @since 2015-11-19 20:15
 * @author vivaxy
 */
'use strict';

const ip = require('ip');
const koa = require('koa');
const log = require('log-util');
const usageTracker = require('usage-tracker');

const isDebug = require('./is-debug.js');

module.exports = (port, absoluteWorkingDirectory, middlewareList, liveReload, openBrowser) => {

    const server = koa();

    middlewareList.push(require('../middleware/error.js'));
    if (liveReload !== false) {
        middlewareList.push(require('../middleware/live-reload.js'));
    }
    middlewareList.push(require('../middleware/file-explorer.js')(absoluteWorkingDirectory));

    middlewareList.forEach(middleware => {
        server.use(middleware);
    });

    const listen = () => {

        return server.listen(port, () => {
            // do not report usages any more
            //// success
            //isDebug || usageTracker.send({
            //    // event
            //    event: 'used'
            //});

            log.info('server :', 'listen', 'http://' + ip.address() + ':' + port + '/');

            let openBrowserFunction = () => {
                require('./open-browser.js')(port);
            };

            if (openBrowser) {
                openBrowserFunction();
            }
            // hit `space` will open page in browser
            let stdIn = process.stdin;
            stdIn.setEncoding('utf8');
            stdIn.on('data', openBrowserFunction);
        }).on('error', err => {
            if (err.code === 'EADDRINUSE') {
                // red
                log.warn('server :', 'port', port, 'in use');
                port++;
                return listen();
            }
        });
    };

    return listen();

};
