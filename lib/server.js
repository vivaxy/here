/**
 * @since 150524 20:41
 * @author vivaxy
 */
var fs = require('fs'),
    url = require('url'),
    http = require('http'),
    path = require('path'),
    util = require('util'),
    events = require("events"),
    childProcess = require('child_process'),

    ip = require('ip'),
    mime = require('mime'),

    html = require('./html'),

    join = path.join,
    exec = childProcess.exec,
    EventEmitter = events.EventEmitter,

    hostname = ip.address(),

    /**
     * create a server
     * @param options
     * @constructor
     */
    Server = function (options) {

        EventEmitter.apply(this, arguments);

        this.log = options.log;
        this.port = options.port;
        this.watch = options.watch;
        this.silent = options.silent;
        this.directory = options.directory;
        this.watcherPort = options.watcherPort;

        this.initialize();
        this.startup();

    };

util.inherits(Server, EventEmitter);
var p = Server.prototype;
module.exports = Server;

p.initialize = function () {
    var _this = this;
    this.server = http.createServer(function (req, res) {

        var reqUrl = decodeURIComponent(req.url),

            pathname = url.parse(reqUrl).pathname,
            responseFile = join(process.cwd(), _this.directory, pathname);

        _this.log.debug('server : ' + req.method + ' ' + reqUrl);

        fs.readFile(responseFile, function (err, data) {
            if (err) {
                // if requested file is a folder, returns files link
                if (err.code === 'EISDIR') {
                    // request a folder
                    // read files
                    fs.readdir(responseFile, function (e, files) {
                        if (e) {
                            _this.processError(res, e);
                        } else {
                            // redirect if index.html found
                            if (~files.indexOf('index.html')) {
                                _this.redirect(res, join(pathname, 'index.html'));
                            } else {
                                _this.respondFolder(res, pathname, files);
                            }
                        }
                    });
                } else {
                    _this.processError(res, err);
                }
            } else {
                // request a file
                var extension = path.extname(responseFile),
                    contentType = mime.lookup(pathname);
                if (extension === '') {
                    contentType = 'application/json'
                }
                _this.respondFile(res, pathname, contentType, data);
            }
        });
    });
};

p.startup = function () {
    var _this = this;
    this.server.on('error', function (err) {
        if (err.code === 'EADDRINUSE') {
            // red
            _this.log.warn('server : port ' + _this.port + ' in use');
            _this.port = _this.port + 1;
            _this.server.listen(_this.port);
            //process.exit(1);
        }
    });
    this.server.listen(this.port, function () {
        var openUrl = 'http://' + hostname + ':' + _this.port + '/';
        // green
        _this.log.info('server : listen ' + openUrl);
        var execCommand = process.platform === "darwin" ?
            'open' : process.platform === "win32" ?
            'start' : 'xdg-open';
        _this.silent || exec(execCommand + ' ' + openUrl);
    });
};

p.processError = function (res, err) {
    // error occurs
    res.writeHead(404);
    res.end(JSON.stringify(err));
};

p.redirect = function (res, to) {
    res.writeHead(302, {
        'Location': to
    });
    res.end();
};

p.respondFolder = function (res, path, files) {
    res.writeHead(200);
    var resp = html(files, hostname, this.port, path, this.directory);
    if (!this.watch) {
        res.end(resp);
    } else {
        res.end(this.addReloadScript(resp));
    }
};

p.respondFile = function (res, path, contentType, data) {
    res.writeHead(200, {
        'Content-Type': contentType
    });
    if (this.watch && contentType === 'text/html') {
        res.end(this.addReloadScript(data.toString('utf-8')));
    } else {
        res.end(data);
    }
};

p.addReloadScript = function (data) {
    var resp = '',
        scriptText = '<script>new WebSocket(\'ws://127.0.0.1:' + this.watcherPort + '\').onmessage = function (data) {if (data.data === \'reload\'){location.reload();}};</script>';
    if (~data.indexOf('</head>')) {
        resp = data.replace('</head>', scriptText + '</head>');
    } else {
        resp = data + scriptText;
    }
    return resp;
};
