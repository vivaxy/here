/**
 * @since 150524 18:23
 * @author vivaxy
 */
var fs = require('fs'),
    path = require('path'),
    util = require('util'),

    ws = require('ws'),
    chokidar = require('chokidar'),

    color = require('./color'),

    log = util.log,
    currentDir = process.cwd(),

    /**
     *
     * @param options
     * @constructor
     */
    Watcher = function (options) {

        this.verbose = options.verbose;
        this.ignored = options.ignored || '';
        this.directory = options.directory;
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
        _this.sockets.push(ws);
        ws.on('close', function (ws) {
            _this.sockets.splice(_this.sockets.indexOf(ws), 1);
        });
    });
    wss.on('error', function (err) {
        if (err.code === 'EADDRINUSE') {
            log(color('watcher port ' + _this.port + ' in use', 'red'));
            _this.port = _this.port + 1;
            return _this.init();
        } else {
            log(err);
        }
    });
    return this;
};

p.listen = function () {
    var _this = this;
    return chokidar.watch(currentDir, {ignored: this.getIgnored.bind(this)}).on('all', function (action, filename) {
        var relativeFilename = path.relative(currentDir, filename);
        _this.verbose && log('[watcher] ' + color(action, 'green') + ' ' + relativeFilename);
        if (action === 'change' || action === 'add' || action === 'unlink' || action === 'addDir') {
            // reload
            _this.sockets.forEach(function (ws) {
                ws.send('reload');
            });
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
        if (path.extname(file) === '.js' || path.extname(file) === '.css' || path.extname(file) === '.html') {
            return false;
        } else {
            return true;
            //return ignoreFiles.some(function (folder) {
            //    return _this.getBaseName(file).indexOf(folder) === 0;
            //});
        }
    }
};

p.getBaseName = function (file) {
    var fileSplit = file.split(path.sep);
    return fileSplit[fileSplit.length - 1];
};

p.getPort = function () {
    return this.port;
};
