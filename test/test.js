/**
 * @since 150201 12:29
 * @author vivaxy
 */

var assert = require("assert");

/**
 * test argument
 * @type {exports}
 */
var argument = require('../lib/argument');
describe('argument', function () {
    it('should return 3000', function () {
        assert.equal(3000, argument.port);
    });
});

/**
 * test serve
 * @type {serve|exports}
 */
var serve = require('../index');
describe('serve', function () {
    it('should be function', function () {
        assert.equal('function', typeof serve);
    })
});
