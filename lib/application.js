/**
 * @since 2015-11-20 13:41
 * @author vivaxy
 */
'use strict';

const path = require('path');

const log = require('log-util');
const commander = require('commander');
const usageTracker = require('usage-tracker');

const config = require('./config');
const startServer = require('./server');
const startWatcher = require('./watcher');
const packageJson = require('../package.json');
const configKey = require('../constant/config');

const EMPTY_STRING = '';
const USAGE_TRACKER_ID_KEY = 'usage-tracker-id';

const formatWatch = (value) => {
    let result = value;
    if (isNaN(Number(value))) {
        result = 0;
    } else if (value < 0) {
        result = 0;
    }
    return result;
};

const formatDirectory = (value) => {
    let absoluteWorkingDirectory = process.cwd();
    if (path.isAbsolute(value)) {
        absoluteWorkingDirectory = value;
    } else {
        absoluteWorkingDirectory = path.join(absoluteWorkingDirectory, value);
    }
    return absoluteWorkingDirectory;
};

const prepare = () => {

    if (config.get(configKey.IS_DEBUG)) {
        config.set(configKey.LOG_LEVEL, 0);
    }

    config.set(configKey.DIRECTORY, formatDirectory('.'));
    config.set(configKey.SERVE_HERE_VERSION, packageJson.version);
    config.set(
        configKey.USAGE_TRACKER_ID,
        packageJson[USAGE_TRACKER_ID_KEY].split(EMPTY_STRING).reverse().join(EMPTY_STRING)
    );

    commander
        .version(config.get(configKey.SERVE_HERE_VERSION), '-v, --version')
        .option(
            `-p, --${configKey.PORT} [port]`,
            'specify port',
            config.get(configKey.PORT)
        )
        .option(
            `-S, --${configKey.SSL}`,
            'switch protocol to https'
        )
        .option(
            `-d, --${configKey.DIRECTORY} [directory]`,
            'specify root directory',
            formatDirectory,
            config.get(configKey.DIRECTORY)
        )
        .option(
            `-w, --${configKey.WATCH} [interval]`,
            'will watch files; once changed, reload pages',
            formatWatch
        )
        .option(
            `-s, --${configKey.SILENT}`,
            'will not open browser'
        )
        .option(
            `-l, --${configKey.LOG_LEVEL} [level]`,
            'output log in some level, lower means more details',
            config.get(configKey.LOG_LEVEL)
        )
        .parse(process.argv);

    log.setLevel(Number(commander[configKey.LOG_LEVEL]));

    if (commander[configKey.PORT]) {
        config.set(configKey.PORT, commander[configKey.PORT]);
    }
    if (commander[configKey.SSL]) {
        config.set(configKey.SSL, commander[configKey.SSL]);
    }

    if (commander[configKey.DIRECTORY]) {
        config.set(configKey.DIRECTORY, commander[configKey.DIRECTORY]);
    }

    if (commander[configKey.WATCH] !== undefined) {
        if (commander[configKey.WATCH] === true) {
            config.set(configKey.WATCH, 0);
        } else {
            config.set(configKey.WATCH, commander[configKey.WATCH]);
        }
    }
    if (commander[configKey.SILENT]) {
        config.set(configKey.SILENT, commander[configKey.SILENT]);
    }

    if (commander[configKey.LOG_LEVEL]) {
        config.set(configKey.LOG_LEVEL, commander[configKey.LOG_LEVEL]);
    }
};

module.exports = () => {

    prepare();

    if (!config.get(configKey.IS_DEBUG)) {

        process.on('uncaughtException', (e) => {

            new usageTracker.UsageTracker({
                owner: config.get(configKey.USAGE_TRACKER_OWNER),
                repo: config.get(configKey.USAGE_TRACKER_REPO),
                number: 4,
                token: config.get(configKey.USAGE_TRACKER_ID),
                report: {
                    '@vivaxy/here-version': config.get(configKey.SERVE_HERE_VERSION)
                }
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

    startServer((nativeServer) => {
        if (config.get(configKey.WATCH) !== false) {
            startWatcher(nativeServer);
        }
    });

};
