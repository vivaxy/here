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
                color('-p, --port      ', 'green') + 'specify port; default 3000' + '\n' +
                color('-d, --directory ', 'green') + 'specify root directory; default .' + '\n' +
                color('-v, --verbose   ', 'green') + 'verbose log' + '\n' +
                color('-s, --silent    ', 'green') + '\x1b[0m' + 'will not open browser'
            );
        } else {
            new Server({
                port: argument.port,
                silent: argument.silent,
                verbose: argument.verbose,
                directory: argument.directory
            });
            new Watcher({
                verbose: argument.verbose
            });
        }
    };

main();
