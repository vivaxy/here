/**
 * @since 150201 13:34
 * @author vivaxy
 */

var config = {
  port: {
    key: ['-p', '--port'],
    value: '8080'
  },
  help: {
    key: ['-h', '--help']
  },
  silent: {
    key: ['-s', '--silent']
  },
  config: {
    key: ['-c', '--config'],
    value: 'here.json'
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