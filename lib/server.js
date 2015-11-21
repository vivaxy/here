/**
 * @since 2015-11-19 20:15
 * @author vivaxy
 */
'use strict';

const path = require('path');

const ip = require('ip');
const koa = require('koa');
const log = require('log-util');
const usageTracker = require('usage-tracker');

const isDebug = require('./is-debug.js');

module.exports = (config) => {

    const server = koa();

    let port = config.port || 3000;
    let directory = config.directory || '.';
    let middlewareList = config.middlewareList || [];
    let liveReload = config.liveReload;
    let openBrowser = config.openBrowser;

    let absoluteWorkingDirectory = process.cwd();
    if (path.isAbsolute(directory)) {
        absoluteWorkingDirectory = directory;
    } else {
        absoluteWorkingDirectory = path.join(absoluteWorkingDirectory, directory);
    }

    middlewareList.push(require('../middleware/error.js'));
    if (liveReload !== undefined) {
        middlewareList.push(require('../middleware/live-reload.js'));
    }
    middlewareList.push(require('../middleware/file-explorer.js')(absoluteWorkingDirectory));

    middlewareList.forEach(middleware => {
        server.use(middleware);
    });

    const listen = () => {

        let nativeServer = server.listen(port, () => {
            // success
            isDebug || usageTracker.send({
                // event
                event: 'used'
            });

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

        if (liveReload !== undefined) {
            require('./watcher.js')(nativeServer, absoluteWorkingDirectory, liveReload);
        }

        return server;
    };

    return listen();

};
