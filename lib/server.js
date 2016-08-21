/**
 * @since 2015-11-19 20:15
 * @author vivaxy
 */
'use strict';

const path = require('path');
const https = require('https');

const ip = require('ip');
const koa = require('koa');
const pem = require('pem');
const log = require('log-util');

const config = require('./config');
const getFileStat = require('./get-file-stat');
const logPrefix = require('../constant/log-prefix');
const configKey = require('../constant/config');

module.exports = (callback) => {

    let nativeServer;

    const directory = config.get(configKey.DIRECTORY);
    const watch = config.get(configKey.WATCH);

    const server = koa();

    const serverErrorCallback = (err) => {
        if (err.code === 'EADDRINUSE') {
            const port = config.get(configKey.PORT);
            log.warn(logPrefix.SERVER, 'port', port, 'in use');
            config.set(configKey.PORT, port + 1);
            listen();
        }
    };

    const openBrowserFunction = () => {
        require('./open-browser')();
    };

    const serverSuccessCallback = () => {
        const port = config.get(configKey.PORT);
        const protocol = config.get(configKey.SSL) ? 'https:' : 'http:';

        log.info(logPrefix.SERVER, 'listen', `${protocol}//${ip.address()}:${port}/`);
        if (!config.get(configKey.SILENT)) {
            openBrowserFunction();
        }
        // hit `space` will open page in browser
        let stdIn = process.stdin;
        stdIn.setEncoding('utf8');
        stdIn.on('data', openBrowserFunction);
        callback(nativeServer);
    };

    const listen = () => {

        let port = config.get(configKey.PORT);

        if (config.get(configKey.SSL)) {
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

    const middlewareList = [];
    // - log request
    // - load route
    // - exec route
    // - live reload
    // - read file
    // - handle error

    middlewareList.push(require('../middleware/log'));
    middlewareList.push(require('../middleware/error'));

    const routeFile = path.join(directory, 'here.js');
    getFileStat(routeFile)((err, stat) => {

        if (!err) {
            if (stat.isFile()) {
                middlewareList.push(require('../middleware/load-route')(server));
            }
        }

        if (watch !== false) {
            middlewareList.push(require('../middleware/live-reload'));
        }
        middlewareList.push(require('../middleware/file-explorer'));
        middlewareList.forEach((middleware) => {
            server.use(middleware);
        });
        listen();
    });

};
