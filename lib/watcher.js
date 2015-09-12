/**
 * @since 150524 18:23
 * @author vivaxy
 */
var path = require('path'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,

    ip = require('ip'),
    ws = require('ws'),
    gaze = require('gaze'),
    log = require('log-util'),
    debounce = require('debounce'),

    cwd = process.cwd(),
    hostname = ip.address(),

    /**
     *
     * @param options
     * @constructor
     */
    Watcher = function (options) {

        EventEmitter.apply(this, arguments);

        this.directory = options.directory;
        this.interval = options.interval;
        this.port = options.port;
        this.sockets = [];

        this._initialize();
        this._startup();

    };

util.inherits(Watcher, EventEmitter);
var p = Watcher.prototype;
p.constructor = Watcher;
module.exports = Watcher;

/**
 * create instances
 * @returns {Watcher}
 */
p._initialize = function () {
    var _this = this;
    var WebSocketServer = ws.Server,
        wss = new WebSocketServer({port: _this.port}, function () {
            log.info('watcher: listen http://' + hostname + ':' + _this.port + '/');
            _this.emit('success');
        });
    wss.on('connection', function (ws) {
        _this.sockets.push(ws);
        ws.on('close', function () {
            _this.sockets.splice(_this.sockets.indexOf(ws), 1);
        });
    });
    wss.on('error', function (err) {
        if (err.code === 'EADDRINUSE') {
            log.warn('watcher: port ' + _this.port + ' in use');
            _this.port = _this.port + 1;
            return _this.initialize();
        } else {
            log.error(err);
        }
    });
    return this;
};

/**
 * start web socket server
 * @returns {*}
 */
p._startup = function () {
    var _this = this,
        reload = debounce(function () {
            log.debug('watcher: reload');
            _this.sockets.forEach(function (ws) {
                try {
                    ws.send('reload');
                } catch (e) {
                    log.debug(e);
                }
            });
        }, this.interval),
        watcher = gaze(['**/*'], function (err, watcher) {
            if (err) {
                log.error(err);
            } else {
                var watched = watcher.watched();
                for (var i in watched) {
                    log.verbose('watcher:', 'watching', path.relative(cwd, i), watched[i].map(function (filePath) {
                        return path.relative(cwd, filePath);
                    }));
                }
            }
        }).on('all', function (action, filePath) {
            log.debug('watcher:', action, path.relative(cwd, filePath));
            reload();
        });
    return this;
};

/**
 *
 * @returns {*}
 */
p.getPort = function () {
    return this.port;
};
