#!/usr/bin/env node

/**
 * @since 2015-11-06 13:47
 * @author vivaxy
 */
'use strict';

const config = require('./lib/config.js');

config.set('isDebug', true);

require('./lib/application.js')();
