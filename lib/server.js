/**
 * @since 2015-11-19 20:15
 * @author vivaxy
 */
'use strict';

const ip = require('ip');
const koa = require('koa');
const log = require('log-util');

const SERVER_LOG_PREFIX = 'server :';

module.exports = (port, absoluteWorkingDirectory, middlewareList, liveReload, openBrowser) => { // eslint-disable-line max-params, max-len

    const server = koa();

    middlewareList.push(require('../middleware/error.js')); // eslint-disable-line global-require
    if (liveReload !== false) {

        middlewareList.push(require('../middleware/live-reload.js')); // eslint-disable-line global-require

    }
    middlewareList.push(require('../middleware/file-explorer.js')(absoluteWorkingDirectory)); // eslint-disable-line global-require, max-len

    middlewareList.forEach((middleware) => {

        server.use(middleware);

    });

    const listen = () => {

        return server.listen(port, () => {
            // do not report usages any more
            // // success
            // isDebug || usageTracker.send({
            //     // event
            //     event: 'used'
            // });

            log.info(SERVER_LOG_PREFIX, 'listen', `http://${ip.address()}:${port}/`);

            let openBrowserFunction = () => {

                require('./open-browser.js')(port); // eslint-disable-line global-require

            };

            if (openBrowser) {

                openBrowserFunction();

            }
            // hit `space` will open page in browser
            let stdIn = process.stdin;

            stdIn.setEncoding('utf8');
            stdIn.on('data', openBrowserFunction);

        }).on('error', (err) => {

            if (err.code === 'EADDRINUSE') {

                // red
                log.warn(SERVER_LOG_PREFIX, 'port', port, 'in use');
                port++;  // eslint-disable-line no-param-reassign
                return listen();

            }

        });

    };

    return listen();

};
