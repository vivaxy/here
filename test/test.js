/**
 * @since 150201 12:29
 * @author vivaxy
 */

var assert = require('assert');

// todo test all
/**
 * test serve
 * @type {serve|exports}
 */
var serve = require('../index');
describe('serve', function () {
    it('should be function', function () {
        assert.equal('function', typeof serve);
    });
});
