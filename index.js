#!/usr/bin/env node
/**
 * @since 150130 17:29
 * @author vivaxy
 */
var path = require('path'),

    Log = require('log-util'),
    commander = require('commander'),

    Server = require('./lib/server'),
    Watcher = require('./lib/watcher'),

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
            route = {};

        try {
            route = require(path.join(process.cwd(), 'here.js'));
        } catch (e) {
            log.debug('custom route not found');
        }

        if (commander.watch === undefined) {
            newServer(commander, log, false, route);
        } else {
            // commander.watch === true || commander.watch === 0, 1, ...
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

module.exports = main;
