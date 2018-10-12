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
const configKey = require('../constant/config.js');

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
  if (config.get(configKey.IS_DEBUG)) {
    config.set(configKey.LOG_LEVEL, 0);
  }

  config.set(configKey.DIRECTORY, formatDirectory('.'));
  config.set(configKey.SERVE_HERE_VERSION, packageJson.version);

  commander
    .version(config.get(configKey.SERVE_HERE_VERSION), '-v, --version')
    .option(
      `-p, --${configKey.PORT} [port]`,
      'specify port',
      config.get(configKey.PORT),
    )
    .option(
      `-S, --${configKey.SSL}`,
      'switch protocol to https',
    )
    .option(
      `-G, --${configKey.GZIP}`,
      'switch protocol to https',
    )
    .option(
      `-d, --${configKey.DIRECTORY} [directory]`,
      'specify root directory',
      formatDirectory,
      config.get(configKey.DIRECTORY),
    )
    .option(
      `-w, --${configKey.WATCH} [interval]`,
      'will watch files; once changed, reload pages',
      formatWatch,
    )
    .option(
      `-s, --${configKey.SILENT}`,
      'will not open browser',
    )
    .option(
      `-l, --${configKey.LOG_LEVEL} [level]`,
      'output log in some level, lower means more details',
      config.get(configKey.LOG_LEVEL),
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
