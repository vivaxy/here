/**
 * @since 2015-11-20 13:41
 * @author vivaxy
 */

const path = require('path');

const log = require('log-util');
const commander = require('commander');

const config = require('./config.js');
const startServer = require('./server.js');
const startWatcher = require('./watcher.js');
const packageJson = require('../package.json');
const configKeys = require('../constant/config.js');

const formatWatch = (value) => {
  if (isNaN(Number(value))) {
    return 0;
  } else if (value < 0) {
    return 0;
  }
  return value;
};

const formatDirectory = (value) => {
  const absoluteWorkingDirectory = process.cwd();
  if (path.isAbsolute(value)) {
    return value;
  }
  return path.join(absoluteWorkingDirectory, value);
};

const prepare = () => {
  if (config.get(configKeys.IS_DEBUG)) {
    config.set(configKeys.LOG_LEVEL, 0);
  }

  config.set(configKeys.DIRECTORY, formatDirectory('.'));
  config.set(configKeys.SERVE_HERE_VERSION, packageJson.version);

  commander
    .version(config.get(configKeys.SERVE_HERE_VERSION), '-v, --version')
    .option(
      `-p, --${configKeys.PORT} [port]`,
      'specify port',
      config.get(configKeys.PORT),
    )
    .option(
      `-S, --${configKeys.SSL}`,
      'switch protocol to https',
    )
    .option(
      `-G, --${configKeys.GZIP}`,
      'open gzip',
    )
    .option(
      `-d, --${configKeys.DIRECTORY} [directory]`,
      'specify root directory',
      formatDirectory,
      config.get(configKeys.DIRECTORY),
    )
    .option(
      `-w, --${configKeys.WATCH} [interval]`,
      'will watch files; once changed, reload pages',
      formatWatch,
    )
    .option(
      `-s, --${configKeys.SILENT}`,
      'will not open browser',
    )
    .option(
      `-l, --${configKeys.LOG_LEVEL} [level]`,
      'output log in some level, lower means more details',
      config.get(configKeys.LOG_LEVEL),
    )
    .parse(process.argv);

  const commanderOptions = commander.opts();

  log.setLevel(Number(commanderOptions[configKeys.LOG_LEVEL]));

  if (commanderOptions[configKeys.PORT]) {
    config.set(configKeys.PORT, commanderOptions[configKeys.PORT]);
  }
  if (commanderOptions[configKeys.DIRECTORY]) {
    config.set(configKeys.DIRECTORY, commanderOptions[configKeys.DIRECTORY]);
  }

  if (commanderOptions[configKeys.SSL]) {
    config.set(configKeys.SSL, commanderOptions[configKeys.SSL]);
  }
  if (commanderOptions[configKeys.GZIP]) {
    config.set(configKeys.GZIP, commanderOptions[configKeys.GZIP]);
  }

  if (commanderOptions[configKeys.WATCH] !== undefined) {
    if (commanderOptions[configKeys.WATCH] === true) {
      config.set(configKeys.WATCH, 0);
    } else {
      config.set(configKeys.WATCH, commanderOptions[configKeys.WATCH]);
    }
  }
  if (commanderOptions[configKeys.SILENT]) {
    config.set(configKeys.SILENT, commanderOptions[configKeys.SILENT]);
  }

  if (commanderOptions[configKeys.LOG_LEVEL]) {
    config.set(configKeys.LOG_LEVEL, commanderOptions[configKeys.LOG_LEVEL]);
  }
};

module.exports = () => {
  prepare();

  if (!config.get(configKeys.IS_DEBUG)) {
    process.on('uncaughtException', (e) => {
      // throw this to preserve default behaviour
      // console this instead of throw error to keep the original error trace
      log.error(e.stack);
      // still exit as uncaught exception
    });
  }

  startServer((nativeServer) => {
    if (config.get(configKeys.WATCH) !== false) {
      startWatcher(nativeServer);
    }
  });
};
