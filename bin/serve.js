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

/**
 * create a server
 */
var server = http.createServer(function (req, res) {

  var pathname = url.parse(req.url).pathname;
  var responseFile = path.join(process.cwd(), argument.directory, pathname);

  var extension = path.extname(responseFile);
  var contentType = mime[extension] || 'text/plain';

  //green
  argument.verbose && util.log(
    '\x1b[36m' + req.method + ' ' + '\x1b[0m' + req.url + ' ' +
    '\x1b[36m' + 'RESPONSE Content-Type' + ' ' + '\x1b[0m' + contentType
  );

  fs.readFile(responseFile, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return true;
    }
    res.writeHead(200, {
      'Content-Type': contentType
    });
    res.end(data);
  });

});

/**
 * start the server
 */
var serve = function () {

  var port = argument.port;

  server.on('error', function (err) {
    if (err.code == 'EADDRINUSE') {

      // red
      util.log('\x1b[31m' + 'PORT ' + port + ' IN USE' + '\x1b[0m');
      process.exit(1);
    }
  });

  server.listen(port, function () {

    var hostname = ip.ipv4;
    var openUrl = 'http://' + hostname + ':' + port + '/';

    // green
    util.log('\x1b[36m' + 'LISTEN' + ' ' + '\x1b[0m' + openUrl);

    argument.silent || exec('open ' + openUrl + 'index.html');
  });

  return server;

};

/**
 * main method
 */
var main = function () {
  if (argument.help) {
    return util.log(
      '\x1b[36m' + 'USAGE' + '\x1b[0m' + ' ' + 'here' + ' ' +
      '[-p PORT]' + ' ' +
      '[-d DIRECTORY]' + ' ' +
      '[-v]' + ' ' +
      '[-s]' + ' ' +
      '-p, --port      : specify port; default 8080' + '\n' +
      '-d, --directory : specify root directory; default ./' + '\n' +
      '-v, --verbose   : verbose log' + '\n' +
      '-s, --silent    : will not open browser' + '\n'
    )
      ;
  } else {
    return serve();
  }
};


module.exports = exports = main;