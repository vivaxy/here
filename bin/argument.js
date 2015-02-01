/**
 * @since 150201 11:02
 * @author vivaxy
 */
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

module.exports = exports = {
  port: getArgumentAfterString('-p', 8080)
};