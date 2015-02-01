/**
 * @since 150201 11:02
 * @author vivaxy
 */

var config = require('./config');

/**
 * arguments
 * @type {Array.<T>|string|*|Buffer|Blob}
 */
var argv = process.argv.slice(2);

/**
 * get argument after very string with default result
 * @param string
 * @param defalut
 * @returns {T|*}
 */
var getArgumentAfterString = function (string, defalut) {
  var index = 0;
  argv.forEach(function (item, i) {
    if (item === string) {
      index = i;
      return true;
    }
  });
  return argv[index + 1] || defalut || null;
};

/**
 * find if -h or --help arguments entered
 * @returns {boolean}
 */
var needHelp = function(){
  var found = false;
  argv.forEach(function (item) {
    config.help.key.forEach(function(it){
      if (item == it){
        found = true;
      }
    });
  });
  return found;
};


module.exports = exports = {
  port: getArgumentAfterString(config.port.key, config.port.value),
  help: needHelp()
};
