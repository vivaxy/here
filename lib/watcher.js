/**
 * @since 2015-11-20 21:48
 * @author vivaxy
 */
'use strict';

const path = require('path');

const log = require('log-util');
const chokidar = require('chokidar');
const debounce = require('debounce');
const socketServer = require('socket.io');

module.exports = (server, absoluteWorkingDirectory, interval) => {

    if (interval === true || interval < 0) {
        interval = 0;
    }

    let socketList = [];

    let io = socketServer(server);
    io.on('connection', (socket) => {
        socketList.push(socket);
        socket.on('disconnect', () => {
            let index = socketList.indexOf(socket);
            if (index > -1) {
                socketList.splice(index, 1);
            }
        });
    });

    let reload = debounce(() => {
        socketList.forEach(socket => {
            log.debug('watcher:', 'reload');
            socket.emit('reload');
        });
    }, interval * 1000);

    let watcher = chokidar.watch(absoluteWorkingDirectory, {
        ignored: [
            '**/node_modules',
            /[\/\\]\./
        ]
    });

    watcher.on('all', (action, filePath) => {
        log.debug('watcher:', action, path.relative(absoluteWorkingDirectory, filePath));
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
        log.info('watcher:', 'pages will be reloaded in', interval, 'seconds after final change was taken');
    });

};
