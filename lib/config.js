/**
 * @since 150201 13:34
 * @author vivaxy
 */

var config = {
    help: {
        key: ['-h', '--help']
    },
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
    watch: {
        key: ['-w', '--watch'],
        value: '0'
    },
    log: {
        key: ['-l', '--log']
    },
    version: {
        key: ['-v', '--version']
    }
};

module.exports = config;
