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
  // green
  console.log('\x1b[36m' + 'REQUEST ' + '\x1b[0m' + req.url);

  var pathname = url.parse(req.url).pathname;

  //// append index.html at the end of path
  //if (pathname.lastIndexOf('/') == pathname.length - 1) pathname += 'index.html';
  //var query = url.parse(req.url).query;

  var responseFile = path.join(process.cwd(), pathname);
  //// use index.html to replace folder
  //if (fs.statSync(responseFile).isDirectory()) responseFile = path.join(responseFile, 'index.html');

  var extension = path.extname(responseFile);

  fs.readFile(responseFile, function (err, data) {
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

      // red
      console.log('\x1b[31m' + 'PORT ' + port + ' IN USE' + '\x1b[0m');
      process.exit(1);
      //} else {
      //  console.log(JSON.stringify(err));
    }
  });

  server.listen(port, function () {

    var hostname = ip.ipv4;
    var openUrl = 'http://' + hostname + ':' + port + '/';

    // green
    console.log('\x1b[36m' + 'SERVER ' + '\x1b[0m' + openUrl);
    exec('open ' + openUrl + 'index.html');
  });

  return server;

};

/**
 * main method
 */
var main = function(){
  if (argument.help) {
    return console.log('usage: here [-p PORT]');
  }else{
    return serve();
  }
};


module.exports = exports = main;