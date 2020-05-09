/**
 * @since 2015-11-20 13:11
 * @author vivaxy
 */

const path = require('path');

const mime = require('mime');
const log = require('log-util');

const configKeys = require('../constant/config.js');
const logPrefix = require('../constant/log-prefix.js');

const config = require('../lib/config.js');
const readFile = require('../lib/read-file.js');
const readFolder = require('../lib/read-folder.js');
const getFileStat = require('../lib/get-file-stat.js');
const buildFileBrowser = require('../lib/build-file-list.js');
const FALLBACK_CONTENT_TYPE = require('../lib/fallback-content-type.js');

const NOT_FOUNT_INDEX = -1;
const INDEX_PAGE = 'index.html';

module.exports = async function(ctx, next) {
  const directory = config.get(configKeys.DIRECTORY);

  // decode for chinese character
  const requestPath = decodeURIComponent(ctx.request.path);
  const fullRequestPath = path.join(directory, requestPath);
  // fix security issue
  if (!fullRequestPath.startsWith(directory)) {
    return await next();
  }
  const stat = await getFileStat(fullRequestPath);

  if (stat.isDirectory()) {
    const files = await readFolder(fullRequestPath);

    if (files.indexOf(INDEX_PAGE) !== NOT_FOUNT_INDEX) {
      ctx.redirect(path.join(requestPath, INDEX_PAGE), '/');
    } else {
      ctx.body = buildFileBrowser(files, requestPath, directory);
      ctx.type = mime.lookup(INDEX_PAGE);
    }
  } else if (stat.isFile()) {
    ctx.body = await readFile(fullRequestPath);
    let type = mime.lookup(fullRequestPath);

    if (path.extname(fullRequestPath) === '') {
      type = FALLBACK_CONTENT_TYPE;
    }

    ctx.type = type;
    ctx.set('Access-Control-Allow-Origin', '*');
    log.debug(logPrefix.RESPONSE, ctx.request.method, requestPath, 'as', type);
  }

  await next();
};
