/**
 * @since 150130 17:29
 * @author vivaxy
 */
var fs = require('fs');
var http = require('http');
var exec = require('child_process').exec;
var path = require('path');
var url = require('url');
var util = require('util');

var mime = require('./mime');
var ip = require('./ip');
var argument = require('./argument');
var html = require('./html');

var port = argument.port;
var hostname = ip.ipv4;

/**
 * create a server
 */
var server = http.createServer(function (req, res) {

    var reqUrl = decodeURIComponent(req.url);

    var pathname = url.parse(reqUrl).pathname;
    var responseFile = path.join(process.cwd(), argument.directory, pathname);

    var extension = path.extname(responseFile);
    var contentType = mime[extension] || 'text/plain';

    //green
    argument.verbose && util.log(
        '\x1b[36m' + req.method + ' ' + '\x1b[0m' + reqUrl
    );

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
                        if (files.indexOf('index.html') > -1) {

                            res.writeHead(302, {
                                'Location': path.join(pathname, 'index.html')
                            });
                            res.end();

                        } else {
                            // respond links
                            res.writeHead(200);

                            var resp = html(files, hostname, port, pathname);

                            res.end(resp);
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
            res.end(data);

        }
    });
});

server.on('error', function (err) {
    if (err.code === 'EADDRINUSE') {

        // red
        util.log(
            '\x1b[31m' + 'PORT ' + port + ' IN USE' + '\x1b[0m'
        );

        port = parseInt(port) + 1;

        server.listen(port);

        //process.exit(1);
    }
});

/**
 * start the server
 */
var serve = function () {

    server.listen(port, function () {

        var openUrl = 'http://' + hostname + ':' + port + '/';

        // green
        util.log('\x1b[36m' + 'LISTEN' + ' ' + '\x1b[0m' + openUrl);

        var execCommand = process.platform === "darwin" ?
            'open' : process.platform === "win32" ?
            'start' : 'xdg-open';

        argument.silent || exec(execCommand + ' ' + openUrl);
    });

};

/**
 * main method
 */
var main = function () {
    if (argument.help) {
        util.log(
            '\x1b[36m' + 'USAGE' + '\x1b[0m' + ' ' + 'here' + ' ' +
            '[-p PORT]' + ' ' +
            '[-d DIRECTORY]' + ' ' +
            '[-v]' + ' ' +
            '[-s]' + ' ' + '\n' +
            '\x1b[36m' + '-p, --port      ' + '\x1b[0m' + 'specify port; default 3000' + '\n' +
            '\x1b[36m' + '-d, --directory ' + '\x1b[0m' + 'specify root directory; default ./' + '\n' +
            '\x1b[36m' + '-v, --verbose   ' + '\x1b[0m' + 'verbose log' + '\n' +
            '\x1b[36m' + '-s, --silent    ' + '\x1b[0m' + 'will not open browser'
        );
    } else {
        serve();
    }
};


module.exports = main;
