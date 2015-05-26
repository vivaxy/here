/**
 * @since 150201 13:34
 * @author vivaxy
 */

var config = {
    port: {
        key: ['-p', '--port'],
        value: '3000'
    },
    directory: {
        key: ['-d', '--directory'],
        value: './'
    },
    silent: {
        key: ['-s', '--silent']
    },
    verbose: {
        key: ['-v', '--verbose']
    },
    help: {
        key: ['-h', '--help']
    },
    noWatch: {
        key: ['-w', '--no-watch']
    }
};

module.exports = config;
