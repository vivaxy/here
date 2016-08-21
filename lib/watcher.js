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

const config = require('./config');
const configKey = require('../constant/config');
const logPrefix = require('../constant/log-prefix');

const SPLICE_COUNT = 1;
const NOT_FOUNT_INDEX = -1;
const A_THOUSAND = 1000;

module.exports = (server) => {

    const absoluteWorkingDirectory = config.get(configKey.DIRECTORY);
    const interval = config.get(configKey.WATCH);

    let socketList = [];

    let io = socketServer(server);

    io.on('connection', (socket) => {

        socketList.push(socket);
        socket.on('disconnect', () => {

            let index = socketList.indexOf(socket);

            if (index > NOT_FOUNT_INDEX) {

                socketList.splice(index, SPLICE_COUNT);

            }

        });

    });

    let reload = debounce(() => {

        socketList.forEach((socket) => {

            log.debug(logPrefix.WATCH, 'reload');
            socket.emit('reload');

        });
    }, interval * A_THOUSAND);

    let watcher = chokidar.watch(absoluteWorkingDirectory, {

        ignored: [
            '**/node_modules',
            /[\/\\]\./,
            '.git',
            '.idea',
            '.DS_Store'
        ]

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
        log.info(logPrefix.WATCH, 'ready,', 'reload in', interval, 'seconds');
    });

};
