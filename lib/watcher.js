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
        this.ignored = options.ignored || '';
        this.verbose = options.verbose;
        this.directory = options.directory;

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
    return this;
};

p.listen = function () {
    var _this = this;
    return chokidar.watch(currentDir, {ignored: this.getIgnored.bind(this)}).on('all', function (action, filename) {
        var relativeFilename = path.relative(currentDir, filename);
        _this.verbose && log(color('watcher ' + action, 'green') + ' ' + relativeFilename);
        if (action === 'change' || 'add' || 'unlink') {
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
        return ignoreFiles.some(function (folder) {
            return _this.getBaseName(file).indexOf(folder) === 0;
        });
    }
};

p.getBaseName = function (file) {
    var fileSplit = file.split(path.sep);
    return fileSplit[fileSplit.length - 1];
};
