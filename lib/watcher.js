/**
 * @since 150524 18:23
 * @author vivaxy
 */
var path = require('path'),
    util = require('util'),

    chokidar = require('chokidar'),

    color = require('./color'),

    currentDir = process.cwd(),
    log = util.log,

    Watcher = function (options) {
        this.ignored = options.ignored || '';
        this.verbose = options.verbose;

        this.init();
        this.listen();
    }, p = {};

Watcher.prototype = p;
p.constructor = Watcher;
module.exports = Watcher;

p.init = function () {
    // todo socket https://github.com/leeluolee/puer/blob/master/lib/connect-puer.js
};

p.listen = function () {
    var _this = this;
    return chokidar.watch(currentDir, {ignored: this.getIgnored()}).on('all', function (action, filename) {
        var relativeFilename = path.relative(currentDir, filename);
        _this.verbose && log(color('watcher ' + action, 'green') + ' ' + relativeFilename);
        if (action === 'change') {
            // todo reload
        }
    });
};

p.getIgnored = function () {
    // todo ignore function
    return [/[\/\\]\./, /node_modules/, '!*.js', '!*.css', '!*.html'];
};

p.inject = function () {
    // todo inject reload js https://github.com/leeluolee/puer/blob/master/vendor/js/reload.js
};
