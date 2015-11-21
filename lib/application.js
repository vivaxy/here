/**
 * @since 2015-11-20 13:41
 * @author vivaxy
 */
'use strict';

const path = require('path');

const log = require('log-util');
const commander = require('commander');
const usageTracker = require('usage-tracker');

const isDebug = require('./is-debug.js');
const startServer = require('./server.js');
const packageJson = require('../package.json');

const main = () => {

    const serveHereVersion = packageJson.version;
    const usageTrackerId = packageJson['usage-tracker-id'].split('').reverse().join('');

    commander
        .version(serveHereVersion, '-v, --version')
        .option('-p, --port [port]', 'specify port', 3000)
        .option('-d, --directory [directory]', 'specify root directory', '.')
        .option('-w, --watch [interval]', 'will watch files; once changed, reload pages')
        .option('-s, --silent', 'will not open browser')
        .option('-l, --log [level]', 'output log in some level, lower means more details', 2)
        .parse(process.argv);

    log.setLevel(isDebug ? 0 : parseInt(commander.log));

    usageTracker.initialize({
        owner: 'vivaxy',
        repo: 'here',
        number: 2,
        token: usageTrackerId,
        report: {
            'serve-here-version': serveHereVersion
        }
    });

    process.on('uncaughtException', (e) => {
        isDebug || new usageTracker.UsageTracker({
            owner: 'vivaxy',
            repo: 'here',
            number: 4,
            token: usageTrackerId,
            report: {
                'serve-here-version': serveHereVersion
            }
        }).on('end', () => {
            process.exit(1);
        }).on('err', () => {
            process.exit(1);
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


    let middlewareList = [];
    let workingDirectory = process.cwd();
    let directory = commander.directory;
    if (path.isAbsolute(directory)) {
        workingDirectory = directory;
    } else {
        workingDirectory = path.join(workingDirectory, directory);
    }

    try {
        middlewareList = require(path.join(workingDirectory, 'here.js'));
        log.debug('route  :', 'custom route found');
    } catch (e) {
        log.debug('route  :', 'custom route not found');
    }

    startServer({
        port: commander.port,
        directory: workingDirectory,
        middlewareList: middlewareList,
        liveReload: commander.watch,
        openBrowser: !commander.silent
    });

};

module.exports = main;
