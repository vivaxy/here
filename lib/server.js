/**
 * @since 2015-11-19 20:15
 * @author vivaxy
 */
const path = require('path');
const https = require('https');

const ip = require('ip');
const Koa = require('koa');
const pem = require('pem');
const log = require('log-util');
const open = require('open');

const config = require('./config.js');
const getFileStat = require('./get-file-stat.js');
const logPrefix = require('../constant/log-prefix.js');
const configKeys = require('../constant/config.js');

module.exports = (callback) => {
  let nativeServer;
  const directory = config.get(configKeys.DIRECTORY);
  const watch = config.get(configKeys.WATCH);

  const server = new Koa();

  const serverErrorCallback = (err) => {
    if (err.code === 'EADDRINUSE') {
      const port = config.get(configKeys.PORT);
      log.warn(logPrefix.SERVER, 'port', port, 'in use');
      config.set(configKeys.PORT, port + 1);
      listen();
    }
  };

  const openBrowserFunction = (url) => {
    open(url)
      .then(() => log.debug(logPrefix.BROWSER, url))
      .catch((e) => log.error(logPrefix.BROWSER, e.message));
  };

  function getIP() {
    const ipType = config.get(configKeys.IP);
    if (ipType === 'localhost') {
      return 'localhost';
    }
    if (ipType === 'private') {
      return '127.0.0.1';
    }
    return ip.address();
  }

  const serverSuccessCallback = () => {
    const port = config.get(configKeys.PORT);
    const protocol = config.get(configKeys.SSL) ? 'https:' : 'http:';
    const url = `${protocol}//${getIP()}:${port}/`;

    log.success(logPrefix.SERVER, 'listen', url);

    if (!config.get(configKeys.SILENT)) {
      openBrowserFunction(url);
    }
    // hit `space` will open page in browser
    const stdIn = process.stdin;
    stdIn.setEncoding('utf8');
    stdIn.on('data', openBrowserFunction.bind(null, url));
    callback(nativeServer);
  };

  const listen = () => {
    const port = config.get(configKeys.PORT);
    if (config.get(configKeys.SSL)) {
      pem.createCertificate({ days: 1, selfSigned: true }, (err, keys) => {
        if (err) {
          log.error(err);
          return;
        }
        nativeServer = https
          .createServer(
            { key: keys.serviceKey, cert: keys.certificate },
            server.callback()
          )
          .on('error', serverErrorCallback)
          .listen(port, serverSuccessCallback);
      });
    } else {
      nativeServer = server
        .listen(port, serverSuccessCallback)
        .on('error', serverErrorCallback);
    }
  };

  const middlewareList = [];
  // - log request
  // - load route
  // - exec route
  // - gzip
  // - live reload
  // - read file
  // - handle error

  middlewareList.push(require('../middleware/log.js'));
  middlewareList.push(require('../middleware/error.js'));

  const routeFile = path.join(directory, 'here.js');
  getFileStat(routeFile)
    .then((stat) => {
      if (stat.isFile()) {
        middlewareList.push(require('../middleware/load-route.js')(server));
      }
      start();
    })
    .catch(() => {
      // routeFile not exists
      start();
    });

  function start() {
    if (config.get(configKeys.GZIP)) {
      middlewareList.push(require('../middleware/gzip.js'));
    }
    if (watch !== false) {
      middlewareList.push(require('../middleware/live-reload.js'));
    }
    middlewareList.push(require('../middleware/file-explorer.js'));
    middlewareList.forEach((middleware) => {
      server.use(middleware);
    });
    listen();
  }
};
