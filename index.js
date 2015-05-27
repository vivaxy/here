#!/usr/bin/env node
/**
 * @since 150130 17:29
 * @author vivaxy
 */
var util = require('util'),

    color = require('./lib/color'),
    argument = require('./lib/argument'),

    log = util.log,

    Server = require('./lib/server'),
    Watcher = require('./lib/watcher'),
    /**
     * main method
     */
    main = function () {
        if (argument.help) {
            log(color('USAGE', 'green') +
                ' ' + 'here' + ' ' +
                '[-p PORT]' + ' ' +
                '[-d DIRECTORY]' + ' ' +
                '[-v]' + ' ' +
                '[-s]' + ' ' + '\n' +
                '[-w]' +
                color('-p, --port      ', 'green') + 'specify port; default 3000' + '\n' +
                color('-d, --directory ', 'green') + 'specify root directory; default .' + '\n' +
                color('-v, --verbose   ', 'green') + 'verbose log' + '\n' +
                color('-s, --silent    ', 'green') + 'will not open browser' +
                color('-w, --watch     ', 'green') + 'will watch html,js,css files; once changed, reload'
            );
        } else {
            var watcherPort = 13000;
            if (argument.watch) {
                var watcher = new Watcher({
                    port: watcherPort,
                    verbose: argument.verbose,
                    directory: argument.directory,
                    callback: function () {
                        watcherPort = watcher.getPort();
                        new Server({
                            port: argument.port,
                            watch: argument.watch,
                            silent: argument.silent,
                            verbose: argument.verbose,
                            directory: argument.directory,
                            watcherPort: watcherPort
                        });
                    }
                });
            } else {
                new Server({
                    port: argument.port,
                    watch: argument.watch,
                    silent: argument.silent,
                    verbose: argument.verbose,
                    directory: argument.directory
                });
            }
        }
    };

main();

module.exports = main;
