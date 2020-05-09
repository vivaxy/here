/**
 * @since 2016-08-21 10:13
 * @author vivaxy
 */

const log = require('log-util');

const logPrefix = require('../constant/log-prefix.js');

module.exports = async function(ctx, next) {
  const beginTime = new Date().getTime();

  const request = ctx.request;
  log.debug(logPrefix.REQUEST, `${request.method} ${request.path}`);

  await next();

  const endTime = new Date().getTime();

  log.debug(logPrefix.TIME, `${endTime - beginTime}ms`);
};
