/**
 * @since 2015-11-20 13:11
 * @author vivaxy
 */

const FALLBACK_CONTENT_TYPE = require('../lib/fallback-content-type.js');

module.exports = async function(ctx, next) {
  try {
    await next();
  } catch (e) {
    ctx.status = 404;
    ctx.body = e.stack;
    ctx.type = FALLBACK_CONTENT_TYPE;
  }
};
