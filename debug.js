#!/usr/bin/env node

/**
 * @since 2015-11-06 13:47
 * @author vivaxy
 */
'use strict';

const config = require('./lib/config');

config.set('isDebug', true);
config.set('gzip', true);

require('./lib/application')();
