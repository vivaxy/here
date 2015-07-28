/**
 * @since 150524 18:23
 * @author vivaxy
 */
var fs = require('fs'),
    path = require('path'),

    ip = require('ip'),
    ws = require('ws'),
    chalk = require('chalk'),
    chokidar = require('chokidar'),
    debounce = require('debounce'),

    log = require('./log'),

    currentDir = process.cwd(),
    hostname = ip.address(),

    /**
     *
     * @param options
     * @constructor
     */
    Watcher = function (options) {

        this.log = options.log;
        this.interval = options.interval;
        this.directory = options.directory;

        this.ignored = options.ignored || '';
        this.callback = options.callback;

        this.port = 13000;
        this.sockets = [];

        this.init();
        this.listen();

    }, p = {};

Watcher.prototype = p;
p.constructor = Watcher;
module.exports = Watcher;

p.init = function () {
    var _this = this;
    var WebSocketServer = ws.Server,
        wss = new WebSocketServer({port: _this.port}, function () {
            _this.callback && _this.callback();
        });
    wss.on('connection', function (ws) {
        log('watcher: ' + chalk.cyan('LISTEN ') + 'http://' + hostname + ':' + _this.port + '/');
        _this.sockets.push(ws);
        ws.on('close', function (ws) {
            _this.sockets.splice(_this.sockets.indexOf(ws), 1);
        });
    });
    wss.on('error', function (err) {
        if (err.code === 'EADDRINUSE') {
            log('watcher: ' + chalk.red('port ' + _this.port + ' in use'));
            _this.port = _this.port + 1;
            return _this.init();
        } else {
            log(err);
        }
    });
    return this;
};

p.listen = function () {
    var _this = this,
        reload = debounce(function () {
            // reload
            _this.sockets.forEach(function (ws) {
                ws.send('reload');
            });
        }, this.interval);
    return chokidar.watch(currentDir, {ignored: this.getIgnored.bind(this)}).on('all', function (action, filename) {
        var relativeFilename = path.relative(currentDir, filename);
        _this.log && log('watcher: ' + chalk.cyan(action) + ' ' + relativeFilename);
        if (action === 'change' || action === 'add' || action === 'unlink' || action === 'addDir') {
            reload();
        }
    });
};

p.getIgnored = function (file) {
    var _this = this,
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

p.getBaseName = function (file) {
    var fileSplit = file.split(path.sep);
    return fileSplit[fileSplit.length - 1];
};

p.getPort = function () {
    return this.port;
};
