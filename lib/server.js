/**
 * @since 150524 20:41
 * @author vivaxy
 */
var fs = require('fs'),
    url = require('url'),
    http = require('http'),
    path = require('path'),
    util = require('util'),
    events = require('events'),
    childProcess = require('child_process'),

    ip = require('ip'),
    mime = require('mime'),
    jade = require('jade'),
    log = require('log-util'),

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

        this.port = options.port;
        this.watch = options.watch;
        this.route = options.route;
        this.silent = options.silent;
        this.directory = options.directory;
        this.watcherPort = options.watcherPort;

        this.reloadJs = '';

        this._initialize();
        this._startup();

    };

util.inherits(Server, EventEmitter);
var p = Server.prototype;
p.constructor = Server;
module.exports = Server;

/**
 * create instance
 * @returns {Server}
 */
p._initialize = function () {
    var _this = this;
    this.server = http.createServer(function (req, res) {
        if (typeof _this.route === 'function') {
            if (_this.route(req, res)) {
                _this._response(req, res);
            }
        } else {
            _this._response(req, res);
        }
    });
    if (this.watch) {
        this.reloadJs = jade.compileFile(join(__dirname, '../res/reload.jade'), {
            pretty: '    '
        })({
            watcherPort: this.watcherPort
        });
    }
    return this;
};

/**
 *
 * @param req
 * @param res
 * @returns {Server}
 */
p._response = function (req, res) {
    var _this = this,
        reqUrl = decodeURIComponent(req.url),
        pathname = url.parse(reqUrl).pathname,
        responseFile = join(process.cwd(), _this.directory, pathname);

    log.debug('server : ' + req.method + ' ' + reqUrl);

    fs.readFile(responseFile, function (err, data) {
        if (err) {
            // if requested file is a folder, returns files link
            if (err.code === 'EISDIR') {
                // request a folder
                // read files
                fs.readdir(responseFile, function (e, files) {
                    if (e) {
                        _this._processError(res, e);
                    } else {
                        // redirect if index.html found
                        if (~files.indexOf('index.html')) {
                            _this._redirect(res, join(pathname, 'index.html'));
                        } else {
                            _this._respondFolder(res, pathname, files);
                        }
                    }
                });
            } else {
                _this._processError(res, err);
            }
        } else {
            // request a file
            var extension = path.extname(responseFile),
                contentType = mime.lookup(pathname);
            if (extension === '') {
                contentType = 'application/json'
            }
            _this._respondFile(res, pathname, contentType, data);
        }
    });
    return this;
};

/**
 * start the server
 * @returns {Server}
 */
p._startup = function () {
    var _this = this;
    this.server.on('error', function (err) {
        if (err.code === 'EADDRINUSE') {
            // red
            log.warn('server : port ' + _this.port + ' in use');
            _this.port = _this.port + 1;
            _this.server.listen(_this.port);
            //process.exit(1);
        }
    });
    this.server.listen(this.port, function () {
        var port = _this.port,
            openUrl = 'http://' + hostname + ':' + port + '/';
        // green
        log.info('server : listen ' + openUrl);
        _this.silent || _this.openBrowser(openUrl);
        _this.emit('start', {
            ip: hostname,
            port: port,
            openUrl: openUrl
        });
    });
    return this;
};

/**
 *
 * @param res
 * @param err
 * @returns {Server}
 */
p._processError = function (res, err) {
    // error occurs
    res.writeHead(404);
    res.end(JSON.stringify(err));
    return this;
};

/**
 *
 * @param res
 * @param to
 * @returns {Server}
 */
p._redirect = function (res, to) {
    res.writeHead(302, {
        'Location': to
    });
    res.end();
    return this;
};

/**
 *
 * @param res
 * @param path
 * @param files
 * @returns {Server}
 */
p._respondFolder = function (res, path, files) {
    res.writeHead(200);
    var resp = html(files, hostname, this.port, path, this.directory);
    if (!this.watch) {
        res.end(resp);
    } else {
        res.end(this._addReloadScript(resp));
    }
    return this;
};

/**
 *
 * @param res
 * @param path
 * @param contentType
 * @param data
 * @returns {Server}
 */
p._respondFile = function (res, path, contentType, data) {
    res.writeHead(200, {
        'Content-Type': contentType
    });
    if (this.watch && contentType === 'text/html') {
        res.end(this._addReloadScript(data.toString('utf-8')));
    } else {
        res.end(data);
    }
    return this;
};

/**
 *
 * @param data
 * @returns {string}
 */
p._addReloadScript = function (data) {
    var resp = '';
    if (~data.indexOf('</head>')) {
        resp = data.replace('</head>', this.reloadJs + '</head>');
    } else {
        resp = data + this.reloadJs;
    }
    return resp;
};

p.openBrowser = function (openUrl) {
    var execCommand = process.platform === 'darwin' ?
        'open' : process.platform === 'win32' ?
        'start' : 'xdg-open';
    exec(execCommand + ' ' + openUrl);
    return this;
};
