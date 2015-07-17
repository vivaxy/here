#!/usr/bin/env node
/**
 * @since 150130 17:29
 * @author vivaxy
 */
var fs = require('fs'),
    util = require('util'),

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
            log(color('USAGE', 'cyan') +
                ' ' + 'here' + ' ' +
                '[-p PORT]' + ' ' +
                '[-d DIRECTORY]' + ' ' +
                '[-s]' + ' ' +
                '[-w INTERVAL(seconds)]' + ' ' +
                '[-l]' + ' ' +
                '[-v]' + '\n' +

                color('-p, --port      ', 'cyan') + 'specify port; default 3000' + '\n' +
                color('-d, --directory ', 'cyan') + 'specify root directory; default .' + '\n' +
                color('-s, --silent    ', 'cyan') + 'will not open browser' + '\n' +
                color('-w, --watch     ', 'cyan') + 'will watch html,js,css files; once changed, reload pages; default interval 0' +
                color('-l, --log       ', 'cyan') + 'output log' +
                color('-v, --version   ', 'cyan') + 'output version' + '\n'
            );
        } else if (argument.version) {
            fs.readFile('./package.json', function (err, fileData) {
                var packageData = JSON.parse(fileData);
                log('serve-here: ' + packageData.version);
            });
        } else {
            var watcherPort = 13000;
            if (argument.watch) {
                var watcher = new Watcher({
                    port: watcherPort,
                    log: argument.log,
                    interval: parseInt(argument.watch),
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
                    log: argument.log,
                    port: parseInt(argument.port),
                    watch: argument.watch,
                    silent: argument.silent,
                    directory: argument.directory
                });
            }
        }
    };

main();

module.exports = main;
