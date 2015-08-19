#!/usr/bin/env node
/**
 * @since 150130 17:29
 * @author vivaxy
 */
var Log = require('log-util'),
    commander = require('commander'),

    Server = require('./lib/server'),
    Watcher = require('./lib/watcher'),

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

        log = new Log(commander.log ? 0 : 2);

        if (commander.watch === undefined) {
            new Server({
                log: log,
                port: commander.port,
                watch: false,
                silent: commander.silent,
                directory: commander.directory
            });
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
                        new Server({
                            log: log,
                            port: commander.port,
                            watch: true,
                            silent: commander.silent,
                            directory: commander.directory,
                            watcherPort: watcherPort
                        });
                    }
                });
        }
    };

main();

module.exports = main;
