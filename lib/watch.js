/**
 * @since 150524 18:23
 * @author vivaxy
 */
var chokidar = require('chokidar'),

    watch = function (dir, callback) {
        chokidar.watch(dir, {ignored: [/[\/\\]\./, 'node_modules', '.idea']}).on('all', function (file, path) {
            console.log(file, path);
            //callback(file, path);
        });
    };

module.exports = watch;
