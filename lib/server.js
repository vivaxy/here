/**
 * @since 150524 20:41
 * @author vivaxy
 */
var fs = require('fs'),
    url = require('url'),
    http = require('http'),
    path = require('path'),
    util = require('util'),
    childProcess = require('child_process'),

    ip = require('./ip'),
    mime = require('./mime'),
    html = require('./html'),
    color = require('./color'),

    log = util.log,
    join = path.join,
    exec = childProcess.exec,

    hostname = ip.ipv4,

    /**
     * create a server
     * @param options
     * @constructor
     */
    Server = function (options) {

        this.port = options.port;
        this.watch = options.watch;
        this.silent = options.silent;
        this.verbose = options.verbose;
        this.directory = options.directory;
        this.watcherPort = options.watcherPort;

        this.init();
        this.listen();

    }, p = {};
Server.prototype = p;
p.constructor = Server;
module.exports = Server;

/**
 * create server instance
 */
p.init = function () {
    var _this = this;
    this.server = http.createServer(function (req, res) {

        var reqUrl = decodeURIComponent(req.url),

            pathname = url.parse(reqUrl).pathname,
            responseFile = join(process.cwd(), _this.directory, pathname),

            extension = path.extname(responseFile),
            contentType = mime[extension] || 'text/plain';

        _this.verbose && log('[server] ' + color(req.method, 'green') + ' ' + reqUrl);

        fs.readFile(responseFile, function (err, data) {
            if (err) {
                // if requested file is a folder, returns files link
                if (err.code === 'EISDIR') {
                    // request a folder
                    // read files
                    fs.readdir(responseFile, function (e, files) {
                        if (e) {
                            // error occurs
                            res.writeHead(404);
                            res.end(JSON.stringify(err));
                        } else {
                            // redirect if index.html found
                            if (~files.indexOf('index.html')) {
                                res.writeHead(302, {
                                    'Location': join(pathname, 'index.html')
                                });
                                res.end();
                            } else {
                                // respond links
                                res.writeHead(200);
                                var resp = html(files, hostname, _this.port, pathname, _this.directory);
                                if (!_this.watch) {
                                    res.end(resp);
                                } else {
                                    res.end(resp.replace('</head>', '<script>new WebSocket(\'ws://127.0.0.1:' + _this.watcherPort + '\').onmessage = function (data) {if (data.data === \'reload\'){location.reload();}};</script></head>'));
                                }
                            }
                        }
                    });
                } else {
                    // other errors
                    res.writeHead(404);
                    res.end(JSON.stringify(err));
                }
            } else {
                // request a file
                res.writeHead(200, {
                    'Content-Type': contentType
                });
                if (_this.watch && contentType === 'text/html') {
                    data = data.toString('utf-8');
                    res.end(data.replace('</head>', '<script>new WebSocket(\'ws://127.0.0.1:' + _this.watcherPort + '\').onmessage = function (data) {if (data.data === \'reload\'){location.reload();}};</script></head>'));
                } else {
                    res.end(data);
                }
            }
        });
    });
};

/**
 * start it
 */
p.listen = function () {
    var _this = this;
    this.server.on('error', function (err) {
        if (err.code === 'EADDRINUSE') {
            // red
            log(color('server port ' + _this.port + ' in use', 'red'));
            _this.port = parseInt(_this.port) + 1;
            _this.server.listen(_this.port);
            //process.exit(1);
        }
    });
    this.server.listen(this.port, function () {
        var openUrl = 'http://' + hostname + ':' + _this.port + '/';
        // green
        log(color('LISTEN ', 'green') + openUrl);
        var execCommand = process.platform === "darwin" ?
            'open' : process.platform === "win32" ?
            'start' : 'xdg-open';
        _this.silent || exec(execCommand + ' ' + openUrl);
    });
};
