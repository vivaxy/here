'use strict';
/**
 * @since 150130 17:29
 * @author vivaxy
 */
var path = require('path');

var log = require('log-util');
var commander = require('commander');
var usageTracker = require('usage-tracker');

var Server = require('./server.js');
var Watcher = require('./watcher.js');

/**
 * new Server();
 * @param commander
 * @param watch
 * @param route
 * @param watcherPort
 * @returns {Server|exports|module.exports}
 */
var newServer = function (commander, watch, route, watcherPort) {
    var server = new Server({
        port: commander.port,
        watch: watch,
        silent: commander.silent,
        directory: commander.directory,
        route: route,
        watcherPort: watcherPort
    });
    server.on('start', function () {
        var stdin = process.stdin;
        stdin.setEncoding('utf8');
        stdin.on('data', function () {
            server.openBrowser();
        });
    });
    return server;
};
/**
 * main method
 */
var main = function (isDebug) {
    var packageJson = require('../package.json');
    var serveHereVersion = packageJson.version;
    var usageTrackerId = packageJson['usage-tracker-id'].split('').reverse().join('');
    commander
        .version(serveHereVersion, '-v, --version')
        .option('-l, --log [level]', 'output log in some level, lower means more details', 2)
        .option('-s, --silent', 'will not open browser')
        .option('-w, --watch [interval]', 'will watch js,css,html files; once changed, reload pages')
        .option('-p, --port [port]', 'specify port', 3000)
        .option('-d, --directory [directory]', 'specify root directory', '.')
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
    process.on('uncaughtException', function (e) {
        isDebug || new usageTracker.UsageTracker({
            owner: 'vivaxy',
            repo: 'here',
            number: 4,
            token: usageTrackerId,
            report: {
                'serve-here-version': serveHereVersion
            }
        }).on('end', function () {
            process.exit(1);
        }).on('err', function () {
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
    isDebug || usageTracker.send({
        // event
        event: 'used'
    });
    var route = {};
    /**
     * read custom route
     */
    try {
        route = require(path.join(process.cwd(), 'here.js'));
    } catch (e) {
        log.debug('custom route not found');
    }

    if (commander.watch === undefined) {
        newServer(commander, false, route, 13000);
    } else { // -w or -w 3  commander.watch === true || commander.watch === 0, 1, ...
        var watcherPort = 13000;
        var watcher = new Watcher({
            port: watcherPort,
            interval: (commander.watch === true ? 0 : commander.watch) * 1000,
            directory: commander.directory
        }).on('success', function () {
            watcherPort = watcher.getPort();
            newServer(commander, true, route, watcherPort);
        });
    }
};

module.exports = main;
