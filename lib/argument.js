/**
 * @since 150201 11:02
 * @author vivaxy
 */

var config = require('./config'),

    /**
     * arguments
     * @type {Array.<T>|string|*|Buffer|Blob}
     */
    argv = process.argv.slice(2),

    /**
     * get argument after very string with default result
     * @param array
     * @param def
     * @returns {T|*}
     */
    getArgumentAfterString = function (array, def) {
        var index = getArgumentIndex(array) + 1;
        if (index > 0 && index < argv.length && argv[index].indexOf('-') !== 0) {
            // has this argument and not starts with -
            return argv[index];
        } else {
            return def === undefined ? null : def;
        }
    },

    /**
     * find where arguments entered
     * @param array
     * @returns {number}
     */
    getArgumentIndex = function (array) {
        var index = -1;
        array.forEach(function (item) {
            var i = argv.indexOf(item);
            if (i > -1) {
                index = i;
            }
        });
        return index;
    },

    /**
     * find if argument exists
     * @param array
     * @returns {boolean}
     */
    isArgumentExists = function (array) {
        return !!~getArgumentIndex(array);
    };

module.exports = {
    port: getArgumentAfterString(config.port.key, config.port.value),
    help: isArgumentExists(config.help.key),
    silent: isArgumentExists(config.silent.key),
    verbose: isArgumentExists(config.verbose.key),
    directory: getArgumentAfterString(config.directory.key, config.directory.value),
    watch: isArgumentExists(config.watch.key)
};
