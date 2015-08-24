#!/usr/bin/env node
/**
 * @since 150130 17:29
 * @author vivaxy
 */
var path = require('path'),

    Log = require('log-util'),
    commander = require('commander'),
    UsageTracker = require('usage-tracker'),

    Server = require('./lib/server'),
    Watcher = require('./lib/watcher'),

    /**
     * new Server();
     * @param commander
     * @param log
     * @param watch
     * @param route
     * @returns {Server|exports|module.exports}
     */
    newServer = function (commander, log, watch, route) {
        return new Server({
            log: log,
            port: commander.port,
            watch: watch,
            silent: commander.silent,
            directory: commander.directory,
            route: route
        });
    },
    /**
     * main method
     */
    main = function () {
        commander
            .version(require('./package.json').version, '-v --version')
            .option('-l, --log', 'output log')
            .option('-s, --silent', 'will not open browser')
            .option('-w, --watch [interval]', 'will watch html,css,js files; once changed, reload pages')
            .option('-p, --port [port]', 'specify port', 3000)
            .option('-d, --directory [directory]', 'specify root directory', '.')
            .parse(process.argv);

        var log = new Log(commander.log ? 0 : 2),
            route = {},
            usageTracker = new UsageTracker({
                owner: 'vivaxy',
                repo: 'here',
                number: 2,
                token: '0f8ecf38612266db610a6b55587b94308ec14669'.split('').reverse().join(''),
                log: log,
                report: {
                    // time
                    timestamp: new Date().getTime(),
                    time: new Date().toString(),
                    // process
                    arch: process.arch,
                    platform: process.platform,
                    version: process.version,
                    versions: process.versions,
                    argv: process.argv,
                    cwd: process.cwd()
                }
            });

        usageTracker.send({
            // event
            event: 'used'
        });

        /**
         * read custom route
         */
        try {
            route = require(path.join(process.cwd(), 'here.js'));
        } catch (e) {
            log.debug('custom route not found');
        }

        if (commander.watch === undefined) {
            newServer(commander, log, false, route);
        } else { // -w or -w 3  commander.watch === true || commander.watch === 0, 1, ...
            var watcherPort = 13000,
                watcherInterval = commander.watch === true ? 0 : commander.watch,
                watcher = new Watcher({
                    port: watcherPort,
                    log: log,
                    interval: watcherInterval * 1000,
                    directory: commander.directory,
                    callback: function () {
                        watcherPort = watcher.getPort();
                        newServer(commander, log, true, route);
                    }
                });
        }
    };

main();
