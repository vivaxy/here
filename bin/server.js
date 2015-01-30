/**
 * @since 150130 17:29
 * @author vivaxy
 */
var fs = require('fs');
var http = require('http');
var exec = require('child_process').exec;
var mime = require('./mime');
var debug = require('./debug');
var path = require('path');

var server = function () {
  http.createServer(function (req, res) {
    console.log(req.url);
    var extensionArray = req.url.split('.');
    var extension = extensionArray[extensionArray.length - 1];
    if (debug) console.log('extension', extension);
    fs.readFile(path.join(process.cwd(), req.url), function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200, {
        'Content-Type': mime[extension]
      });
      res.end(data);
    });
  }).listen(8080);
  console.log('server started at http://127.0.0.1:8080');
  exec('open http://127.0.0.1:8080');
};

exports = module.exports = server;