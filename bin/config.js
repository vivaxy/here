/**
 * @since 150201 13:34
 * @author vivaxy
 */

var config = {
    port: {
        key: ['-p', '--port'],
        value: '3000'
    },
    help: {
        key: ['-h', '--help']
    },
    silent: {
        key: ['-s', '--silent']
    },
    directory: {
        key: ['-d', '--directory'],
        value: './'
    },
    verbose: {
        key: ['-v', '--verbose']
    }
};


module.exports = exports = config;