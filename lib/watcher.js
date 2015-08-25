/**
 * @since 150524 18:23
 * @author vivaxy
 */
var fs = require('fs'),
    path = require('path'),

    ip = require('ip'),
    ws = require('ws'),
    log = require('log-util'),
    chokidar = require('chokidar'),
    debounce = require('debounce'),

    currentDir = process.cwd(),
    hostname = ip.address(),

    /**
     *
     * @param options
     * @constructor
     */
    Watcher = function (options) {

        this.interval = options.interval;
        this.directory = options.directory;

        this.ignored = options.ignored || '';
        this.callback = options.callback;

        this.port = 13000;
        this.sockets = [];

        this.initialize();
        this.startup();

    },
    p = {};

Watcher.prototype = p;
p.constructor = Watcher;
module.exports = Watcher;

/**
 * create instances
 * @returns {p}
 */
p.initialize = function () {
    var _this = this;
    var WebSocketServer = ws.Server,
        wss = new WebSocketServer({port: _this.port}, function () {
            log.info('watcher: listen http://' + hostname + ':' + _this.port + '/');
            _this.callback && _this.callback();
        });
    wss.on('connection', function (ws) {
        _this.sockets.push(ws);
        ws.on('close', function (ws) {
            _this.sockets.splice(_this.sockets.indexOf(ws), 1);
        });
    });
    wss.on('error', function (err) {
        if (err.code === 'EADDRINUSE') {
            log.warn('watcher: port ' + _this.port + ' in use');
            _this.port = _this.port + 1;
            return _this.init();
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
p.startup = function () {
    var _this = this,
        reload = debounce(function () {
            // reload
            log.debug('watcher: reload');
            _this.sockets.forEach(function (ws) {
                ws.send('reload');
            });
        }, this.interval);
    return chokidar.watch(currentDir, {ignored: this.getIgnored.bind(this)}).on('all', function (action, filename) {
        var relativeFilename = path.relative(currentDir, filename);
        log.debug('watcher: ' + _this.toDashedString(action) + ' ' + relativeFilename);
        if (action === 'change' || action === 'add' || action === 'unlink' || action === 'addDir') {
            reload();
        }
    });
};

/**
 * is this file or folder ignored for file watcher
 * @param file
 * @returns {boolean}
 */
p.getIgnored = function (file) {
    var _this = this,
    // todo split ignore config into ignore.js
        ignoreFolders = ['node_modules'],
        ignoreFiles = [];
    if (this.getBaseName(file).indexOf('.') === 0) {
        // start with .
        return true;
    }
    if (!fs.existsSync(file)) {
        return true;
    }
    // ignore files
    if (fs.lstatSync(file).isDirectory()) {
        // folder
        return ignoreFolders.some(function (folder) {
            return _this.getBaseName(file).indexOf(folder) === 0;
        });
    } else {
        // file
        // watch js css html
        return !(path.extname(file) === '.js' || path.extname(file) === '.css' || path.extname(file) === '.html');
    }
};

/**
 * todo what this for? is it path.basename?
 * @param file
 * @returns {*}
 */
p.getBaseName = function (file) {
    var fileSplit = file.split(path.sep);
    return fileSplit[fileSplit.length - 1];
};

/**
 *
 * @returns {*}
 */
p.getPort = function () {
    return this.port;
};

/**
 * convert camel string to dashed string
 * someArgument => some-argument
 * @param string
 * @returns {string}
 */
p.toDashedString = function (string) {
    return Array.prototype.map.call(string, function (letter) {
        if (letter.toUpperCase() === letter) {
            return '-' + letter.toLowerCase();
        } else {
            return letter;
        }
    }).join('');
};
