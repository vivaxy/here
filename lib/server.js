/**
 * @since 2015-11-19 20:15
 * @author vivaxy
 */
'use strict';

const https = require('https');

const ip = require('ip');
const koa = require('koa');
const pem = require('pem');
const log = require('log-util');

const config = require('./config');

const SERVER_LOG_PREFIX = 'server :';

module.exports = (middlewareList, callback) => {

    let nativeServer;

    const directory = config.get('directory');
    const watch = config.get('watch');
    const silent = config.get('silent');

    const server = koa();

    middlewareList.push(require('../middleware/error'));
    if (watch !== false) {
        middlewareList.push(require('../middleware/live-reload'));
    }
    middlewareList.push(require('../middleware/file-explorer')(directory));
    middlewareList.forEach((middleware) => {
        server.use(middleware);
    });

    const serverErrorCallback = (err) => {
        if (err.code === 'EADDRINUSE') {
            const port = config.get('port');
            log.warn(SERVER_LOG_PREFIX, 'port', port, 'in use');
            config.set('port', port + 1);
            listen();
        }
    };

    const openBrowserFunction = () => {
        const port = config.get('port');
        require('./open-browser')(port);
    };

    const serverSuccessCallback = () => {
        const port = config.get('port');
        const ssl = config.get('ssl');

        const protocol = ssl ? 'https:' : 'http:';

        log.info(SERVER_LOG_PREFIX, 'listen', `${protocol}//${ip.address()}:${port}/`);
        if (!silent) {
            openBrowserFunction();
        }
        // hit `space` will open page in browser
        let stdIn = process.stdin;
        stdIn.setEncoding('utf8');
        stdIn.on('data', openBrowserFunction);
        callback(nativeServer);
    };

    const listen = () => {

        let port = config.get('port');

        if (config.get('ssl')) {
            pem.createCertificate({days: 1, selfSigned: true}, (err, keys) => {
                if (err) {
                    log.error(err);
                    return;
                }
                nativeServer = https.createServer({key: keys.serviceKey, cert: keys.certificate}, server.callback())
                    .on('error', serverErrorCallback)
                    .listen(port, serverSuccessCallback);
            });
        } else {
            nativeServer = server.listen(port, serverSuccessCallback)
                .on('error', serverErrorCallback);
        }

    };

    listen();

};
