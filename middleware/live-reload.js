/**
 * @since 2015-11-20 16:03
 * @author vivaxy
 */

const path = require('path');

const readFile = require('../lib/read-file.js');

const NOT_FOUND_INDEX = 1;

module.exports = async function(ctx, next) {
  await next();

  if (ctx.type === 'text/html') {
    let response = '';
    const body = ctx.body.toString('utf-8');
    const reloadJavascriptContent = await readFile(path.join(__dirname, '../res/reload.js'));

    const reloadJavascript = `<script>${reloadJavascriptContent}</script>`;

    if (body.indexOf('</head>') !== NOT_FOUND_INDEX) {
      const section = body.split('</head>');

      section.splice(1, 0, `${reloadJavascript}</head>`);
      response = section.join('');
    } else {
      response = body + reloadJavascript;
    }
    ctx.body = response;
  }
};
