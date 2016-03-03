/**
 * @since 2015-11-20 13:41
 * @author vivaxy
 */
'use strict';

const path = require('path');

const log = require('log-util');
const commander = require('commander');

const config = require('./config.js');
const startServer = require('./server.js');
const startWatcher = require('./watcher.js');
const packageJson = require('../package.json');

const EMPTY_STRING = '';
const DEFAULT_PORT = 3000;
const PARSE_INT_RADIX = 10;
const DEFAULT_LOG_LEVEL = 2;
const IS_DEBUG_KEY = 'isDebug';
const REPOSITORY_NAME = 'here';
const REPOSITORY_OWNER = 'vivaxy';
const USAGE_TRACKER_ID_KEY = 'usage-tracker-id';

module.exports = () => { // eslint-disable-line max-statements

    const IS_DEBUG = config.get(IS_DEBUG_KEY);
    const SERVE_HERE_VERSION = packageJson.version;
    const USAGE_TRACKER_ID = packageJson[USAGE_TRACKER_ID_KEY].split(EMPTY_STRING).reverse().join(EMPTY_STRING);

    commander
        .version(SERVE_HERE_VERSION, '-v, --version')
        .option('-p, --port [port]', 'specify port', DEFAULT_PORT)
        .option('-d, --directory [directory]', 'specify root directory', '.')
        .option('-w, --watch [interval]', 'will watch files; once changed, reload pages')
        .option('-s, --silent', 'will not open browser')
        .option('-l, --log [level]', 'output log in some level, lower means more details', DEFAULT_LOG_LEVEL)
        .parse(process.argv);

    log.setLevel(parseInt(commander.log, PARSE_INT_RADIX));

    // usageTracker.initialize({
    //     owner: REPOSITORY_OWNER,
    //     repo: REPOSITORY_NAME,
    //     number: 2,
    //     token: USAGE_TRACKER_ID,
    //     report: {
    //         'serve-here-version': SERVE_HERE_VERSION
    //     }
    // });

    if (!IS_DEBUG) {

        process.on('uncaughtException', (e) => {

            const usageTracker = require('usage-tracker'); // eslint-disable-line global-require

            new usageTracker.UsageTracker({
                owner: REPOSITORY_OWNER,
                repo: REPOSITORY_NAME,
                number: 4,
                token: USAGE_TRACKER_ID,
                report: {
                    'serve-here-version': SERVE_HERE_VERSION
                }
                // }).on('end', () => {
                //     process.exit(1);
                // }).on('err', () => {
                //     process.exit(1);
            }).send({
                // JSON.stringify(err) will convert err to `{}`
                // use error.stack for more details
                error: e.stack.split('\n')
            });
            // throw this to preserve default behaviour
            // console this instead of throw error to keep the original error trace
            log.error(e.stack);
            // still exit as uncaught exception

        });

    }

    let middlewareList = [];
    let absoluteWorkingDirectory = process.cwd(); // eslint-disable-line
    let directory = commander.directory; // eslint-disable-line

    if (path.isAbsolute(directory)) {

        absoluteWorkingDirectory = directory;

    } else {

        absoluteWorkingDirectory = path.join(absoluteWorkingDirectory, directory);

    }

    let liveReload = commander.watch;

    if (liveReload === undefined) {

        liveReload = false;

    } else if (isNaN(parseFloat(liveReload))) {

        liveReload = 0;

    } else if (liveReload < 0) {

        liveReload = 0;

    }

    let nativeServer = startServer(commander.port, absoluteWorkingDirectory, middlewareList, liveReload, !commander.silent); // eslint-disable-line max-len

    if (liveReload !== false) {

        startWatcher(nativeServer, absoluteWorkingDirectory, liveReload);

    }

};
