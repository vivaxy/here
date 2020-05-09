/**
 * @since 2015-11-20 21:48
 * @author vivaxy
 */

const path = require('path');

const log = require('log-util');
const chokidar = require('chokidar');
const debounce = require('debounce');
const socketServer = require('socket.io');

const config = require('./config.js');
const configKeys = require('../constant/config.js');
const logPrefix = require('../constant/log-prefix.js');

const SPLICE_COUNT = 1;
const NOT_FOUNT_INDEX = -1;
const A_THOUSAND = 1000;

module.exports = (server) => {
  const absoluteWorkingDirectory = config.get(configKeys.DIRECTORY);
  const interval = config.get(configKeys.WATCH);

  const socketList = [];

  const io = socketServer(server);

  io.on('connection', (socket) => {
    socketList.push(socket);
    socket.on('disconnect', () => {
      const index = socketList.indexOf(socket);
      if (index > NOT_FOUNT_INDEX) {
        socketList.splice(index, SPLICE_COUNT);
      }
    });
  });

  const reload = debounce(() => {
    socketList.forEach((socket) => {
      log.debug(logPrefix.WATCH, 'reload');
      socket.emit('reload');
    });
  }, interval * A_THOUSAND);

  const watcher = chokidar.watch(absoluteWorkingDirectory, {
    ignored: [
      '**/node_modules',
      /[\/\\]\./,
      '.git',
      '.idea',
      '.DS_Store',
    ],
  });

  watcher.on('all', (action, filePath) => {
    log.debug(logPrefix.WATCH, action, path.relative(absoluteWorkingDirectory, filePath));
    switch (action) {
      case 'add':
      case 'addDir':
        break;
      default:
        reload();
        break;
    }
  });

  watcher.on('ready', () => {
    log.success(logPrefix.WATCH, 'ready,', 'reload in', interval, 'seconds');
  });
};
