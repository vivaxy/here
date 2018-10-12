/**
 * @since 2015-11-20 15:40
 * @author vivaxy
 */

const configKeys = require('../constant/config.js');

const config = {
  [configKeys.IS_DEBUG]: false,

  [configKeys.PORT]: 3000,
  [configKeys.SSL]: false,
  [configKeys.GZIP]: false,
  [configKeys.DIRECTORY]: '.',
  [configKeys.WATCH]: false,
  [configKeys.SILENT]: false,
  [configKeys.LOG_LEVEL]: 2,

  [configKeys.SERVE_HERE_VERSION]: '0.0.0',
};

exports.set = (key, value) => {
  config[key] = value;
  return value;
};

exports.get = (key) => {
  return config[key];
};
