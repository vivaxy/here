/**
 * @since 150205 09:21
 * @author vivaxy
 */

var listStyle = 'body' +
  '{' +
  'background:#eee;' +
  'width:100%;' +
  'margin:0;' +
  '}' +

  'a' +
  '{display:block;' +
  '-webkit-tap-highlight-color:rgba(0,0,0,0.1);' +
  'height:48px;' +
  'width:100%;' +
  'text-decoration:none;' +
  'background-color:#fff;' +
  'border-bottom:1px solid #ddd;' +
  'overflow:hidden;' +
  '}' +

  'a span' +
  '{' +
  'display:block;' +
  'height:32px;' +
  'line-height:32px;' +
  'font-size:16px;' +
  'color:#000;' +
  'margin:8px 0 8px 48px;' +
  'overflow:hidden;' +
  'text-overflow:ellipsis;' +
  'white-space:nowrap;' +
  '}' +

  '.html' +
  '{' +
  'color:#3498db;' +
  '}' +

  '.dir' +
  '{' +
  'color:#2ecc71;' +
  '}';


var template = function (list) {
  return '' +
    '<html>' +
    '<head>' +
    '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>' +
    '</head>' +
    '<body>' +
    list.join('') + '' +
    '<style>' + listStyle + '</style>' +
    '</body>' +
    '</html>';
};

module.exports = exports = template;