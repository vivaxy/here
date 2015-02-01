/**
 * @since 150130 17:29
 * @author vivaxy
 */
var fs = require('fs');
var http = require('http');
var exec = require('child_process').exec;
var path = require('path');
var url = require('url');

var mime = require('./mime');
var ip = require('./ip');
var argument = require('./argument');

/**
 * create a server
 */
var server = http.createServer(function (req, res) {
  console.log(req.url);

  var pathname = url.parse(req.url).pathname;
  //var query = url.parse(req.url).query;

  var extension = path.extname(pathname);

  fs.readFile(path.join(process.cwd(), pathname), function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return true;
    }
    res.writeHead(200, {
      'Content-Type': mime[extension] || 'text/plain'
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
      console.log('\x1b[31mPORT ' + port + ' IN USE\x1b[0m');
      process.exit(1);
      //} else {
      //  console.log(JSON.stringify(err));
    }
  });

  server.listen(port, function () {

    var hostname = ip.ipv4;
    var openUrl = 'http://' + hostname + ':' + port + '/';

    console.log('SERVER STARTED \x1b[32m' + openUrl + '\x1b[0m');
    exec('open ' + openUrl + 'index.html');
  });

};

module.exports = exports = serve;