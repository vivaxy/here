/**
 * @since 150130 17:07
 * @author vivaxy
 */
var mimeType = {

    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.ftl': 'text/html',
    '.htm': 'text/html',
    '.txt': 'text/plain',

    '.svg': 'image/svg+xml',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.jpeg': 'image/jpeg',
    '.bmp': 'image/bmp',
    '.ico': 'image/x-icon',

    '': 'application/json',
    '.json': 'application/json',
    '.xml': 'application/xml',
    // font
    '.ttf': 'application/x-font-ttf',
    '.otf': 'application/x-font-otf',
    '.woff': 'application/x-font-woff',
    '.eot': 'application/vnd.ms-fontobject',
    // file
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.swf': 'application/x-shockwave-flash',
    // etc
    '.latex': 'application/x-latex',

    '.mp3': 'audio/mpeg',

    '.avi': 'video/x-msvideo'
};

module.exports = exports = mimeType;