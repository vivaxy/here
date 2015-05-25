/**
 * @since 150524 18:23
 * @author vivaxy
 */
var path = require('path'),
    util = require('util'),

    ws = require('ws'),
    chokidar = require('chokidar'),

    color = require('./color'),

    currentDir = process.cwd(),
    log = util.log,

    /**
     *
     * @param options
     * @constructor
     */
    Watcher = function (options) {
        this.ignored = options.ignored || '';
        this.verbose = options.verbose;

        this.init();
        this.listen();
        this.sockets = [];
    }, p = {};

Watcher.prototype = p;
p.constructor = Watcher;
module.exports = Watcher;

p.init = function () {
    var _this = this;
    // socket https://github.com/leeluolee/puer/blob/master/lib/connect-puer.js
    var WebSocketServer = ws.Server,
        wss = new WebSocketServer({port: 13000});
    wss.on('connection', function (ws) {
        _this.sockets.push(ws);
        ws.on('close', function (ws) {
            _this.sockets.splice(_this.sockets.indexOf(ws), 1);
        });
    });
};

p.listen = function () {
    var _this = this;
    return chokidar.watch(currentDir, {ignored: this.getIgnored()}).on('all', function (action, filename) {
        var relativeFilename = path.relative(currentDir, filename);
        _this.verbose && log(color('watcher ' + action, 'green') + ' ' + relativeFilename);
        if (action === 'change') {
            // reload
            _this.sockets.forEach(function (ws) {
                ws.send('reload');
            });
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
