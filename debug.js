#!/usr/bin/env node

/**
 * @since 2015-11-06 13:47
 * @author vivaxy
 */

const config = require('./lib/config.js');
const configKeys = require('./constant/config.js');

config.set(configKeys.IS_DEBUG, true);

require('./lib/application')();
