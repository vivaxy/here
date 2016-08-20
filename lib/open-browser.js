/**
 * @since 2015-11-20 13:26
 * @author vivaxy
 */
'use strict';

const childProcess = require('child_process');

const ip = require('ip');
const log = require('log-util');

const config = require('./config');

const BROWSER_LOG_PREFIX = 'browser:';

module.exports = (port) => {

    // always use current ip address

    const protocol = config.get('ssl') ? 'https:' : 'http:';

    const openUrl = `${protocol}//${ip.address()}:${port}/`;
    const execCommand = process.platform === 'darwin' ? 'open' :
        process.platform === 'win32' ? 'start' : 'xdg-open';

    childProcess.exec(`${execCommand} ${openUrl}`, () => {
        // open browser succeeded
        log.debug(BROWSER_LOG_PREFIX, execCommand, openUrl);
    });

};
