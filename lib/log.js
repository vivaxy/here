/**
 * @since 15-07-28 20:01
 * @author vivaxy
 */
var chalk = require('chalk'),
    dateformat = require('dateformat'),

    log = function () {
        var time = chalk.grey('[' + dateformat(new Date(), 'HH:MM:ss') + ']'),
            args = Array.prototype.slice.call(arguments);
        args.unshift(time);
        console.log.apply(console, args);
        return this;
    };

module.exports = log;
