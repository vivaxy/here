/**
 * @since 2015-11-20 13:41
 * @author vivaxy
 */
'use strict';

const path = require('path');

const log = require('log-util');
const commander = require('commander');
const usageTracker = require('usage-tracker');

const config = require('./config');
const startServer = require('./server');
const startWatcher = require('./watcher');
const packageJson = require('../package.json');

const EMPTY_STRING = '';
const ROUTE_LOG_PREFIX = 'route  :';
const USAGE_TRACKER_ID_KEY = 'usage-tracker-id';

const formatWatch = (value) => {
    let result = value;
    if (isNaN(Number(value))) {
        result = 0;
    } else if (value < 0) {
        result = 0;
    }
    return result;
};

const formatDirectory = (value) => {
    let absoluteWorkingDirectory = process.cwd();
    if (path.isAbsolute(value)) {
        absoluteWorkingDirectory = value;
    } else {
        absoluteWorkingDirectory = path.join(absoluteWorkingDirectory, value);
    }
    return absoluteWorkingDirectory;
};

const prepare = () => {
    config.set('serveHereVersion', packageJson.version);
    config.set('usageTrackerId', packageJson[USAGE_TRACKER_ID_KEY].split(EMPTY_STRING).reverse().join(EMPTY_STRING));

    commander
        .version(config.get('serveHereVersion'), '-v, --version')
        .option('-p, --port [port]', 'specify port', config.get('port'))
        .option('-S, --ssl', 'switch protocol to https')
        .option('-d, --directory [directory]', 'specify root directory', formatDirectory, config.get('directory'))
        .option('-w, --watch [interval]', 'will watch files; once changed, reload pages', formatWatch)
        .option('-s, --silent', 'will not open browser')
        .option('-l, --logLevel [level]', 'output log in some level, lower means more details', config.get('logLevel'))
        .parse(process.argv);

    log.setLevel(Number(commander.logLevel));

    if (commander.port) {
        config.set('port', commander.port);
    }
    if (commander.ssl) {
        config.set('ssl', commander.ssl);
    }
    if (commander.directory) {
        config.set('directory', commander.directory);
    }
    if (commander.watch !== undefined) {
        if (commander.watch === true) {
            config.set('watch', 0);
        } else {
            config.set('watch', commander.watch);
        }
    }
    if (commander.silent) {
        config.set('silent', commander.silent);
    }
    if (commander.logLevel) {
        config.set('logLevel', commander.logLevel);
    }
};

module.exports = () => {

    prepare();

    const isDebug = config.get('isDebug');

    if (!isDebug) {

        process.on('uncaughtException', (e) => {

            new usageTracker.UsageTracker({
                owner: config.get('usageTrackerOwner'),
                repo: config.get('usageTrackerRepo'),
                number: 4,
                token: config.get('usageTrackerId'),
                report: {
                    'serve-here-version': config.get('serveHereVersion')
                }
            }).send({
                // JSON.stringify(err) will convert err to `{}`
                // use error.stack for more details
                error: e.stack.split('\n')
            });
            // throw this to preserve default behaviour
            // console this instead of throw error to keep the original error trace
            log.error(e.stack);
            // still exit as uncaught exception
        });

    }

    let middlewareList = [];
    let directory = config.get('directory');
    let watch = config.get('watch');

    try {
        let route = require(path.join(directory, 'here.js'));

        if (Reflect.apply(Object.prototype.toString, route, undefined) === '[object Array]') {
            middlewareList = route;
            log.debug(ROUTE_LOG_PREFIX, 'custom route found');
        } else {
            log.error(ROUTE_LOG_PREFIX, 'route is not an array');
        }
    } catch (e) {
        log.debug(ROUTE_LOG_PREFIX, 'custom route not found');
    }

    startServer(middlewareList, (nativeServer) => {
        if (watch !== false) {
            startWatcher(nativeServer);
        }
    });

};
