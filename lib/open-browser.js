/**
 * @since 2015-11-20 13:26
 * @author vivaxy
 */
'use strict';

const childProcess = require('child_process');

const ip = require('ip');
const log = require('log-util');

const BROWSER_LOG_PREIFX = 'browser:';

module.exports = (port) => {

    // always use current ip address
    // let openUrl = 'http://' + ip.address() + ':' + port + '/';
    let openUrl = `http://${ip.address()}:${port}/`;
    let execCommand = process.platform === 'darwin' ? 'open' :
        process.platform === 'win32' ? 'start' : 'xdg-open';

    childProcess.exec(`${execCommand} ${openUrl}`, () => {

        // open browser succeeded
        log.debug(BROWSER_LOG_PREIFX, execCommand, openUrl);

    });

};
