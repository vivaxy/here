/**
 * @since 2015-11-20 13:41
 * @author vivaxy
 */
'use strict';

const path = require('path');

const log = require('log-util');
const commander = require('commander');
const usageTracker = require('usage-tracker');

const isDebug = require('./is-debug.js');
const startServer = require('./server.js');
const startWatcher = require('./watcher.js');
const packageJson = require('../package.json');

module.exports = () => {

    const serveHereVersion = packageJson.version;
    const usageTrackerId = packageJson['usage-tracker-id'].split('').reverse().join('');

    commander
        .version(serveHereVersion, '-v, --version')
        .option('-p, --port [port]', 'specify port', 3000)
        .option('-d, --directory [directory]', 'specify root directory', '.')
        .option('-w, --watch [interval]', 'will watch files; once changed, reload pages')
        .option('-s, --silent', 'will not open browser')
        .option('-l, --log [level]', 'output log in some level, lower means more details', 2)
        .parse(process.argv);

    log.setLevel(parseInt(commander.log));

    usageTracker.initialize({
        owner: 'vivaxy',
        repo: 'here',
        number: 2,
        token: usageTrackerId,
        report: {
            'serve-here-version': serveHereVersion
        }
    });

    isDebug || process.on('uncaughtException', (e) => {
        new usageTracker.UsageTracker({
            owner: 'vivaxy',
            repo: 'here',
            number: 4,
            token: usageTrackerId,
            report: {
                'serve-here-version': serveHereVersion
            }
        }).on('end', () => {
            process.exit(1);
        }).on('err', () => {
            process.exit(1);
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

    let middlewareList = [];
    let absoluteWorkingDirectory = process.cwd();
    let directory = commander.directory;
    if (path.isAbsolute(directory)) {
        absoluteWorkingDirectory = directory;
    } else {
        absoluteWorkingDirectory = path.join(absoluteWorkingDirectory, directory);
    }
    let liveReload = commander.watch;
    if (liveReload === undefined) {
        liveReload = false;
    } else if (isNaN(parseFloat(liveReload))) {
        liveReload = 0;
    } else if (liveReload < 0) {
        liveReload = 0;
    }

    try {
        let route = require(path.join(absoluteWorkingDirectory, 'here.js'));
        if (Object.prototype.toString.apply(route) === '[object Array]') {
            middlewareList = route;
            log.debug('route  :', 'custom route found');
        } else {
            log.error('route  :', 'route is not an array');
        }
    } catch (e) {
        log.debug('route  :', 'custom route not found');
    }

    let nativeServer = startServer(commander.port, absoluteWorkingDirectory, middlewareList, liveReload, !commander.silent);

    if (liveReload !== false) {
        startWatcher(nativeServer, absoluteWorkingDirectory, liveReload);
    }

};
