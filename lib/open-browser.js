/**
 * @since 2015-11-20 13:26
 * @author vivaxy
 */

const childProcess = require('child_process');

const ip = require('ip');
const log = require('log-util');

const config = require('./config.js');
const logPrefix = require('../constant/log-prefix.js');
const configKeys = require('../constant/config.js');

module.exports = () => {
    // always use current ip address

    const protocol = config.get(configKeys.SSL) ? 'https:' : 'http:';
    const port = config.get(configKeys.PORT);

    const openUrl = `${protocol}//${ip.address()}:${port}/`;
    const execCommand = process.platform === 'darwin' ? 'open' :
        process.platform === 'win32' ? 'start' : 'xdg-open';

    childProcess.exec(`${execCommand} ${openUrl}`, () => {
        // open browser succeeded
        log.debug(logPrefix.BROWSER, execCommand, openUrl);
    });
};
