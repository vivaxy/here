/**
 * @since 150201 12:29
 * @author vivaxy
 */

var assert = require("assert");

/**
 * test argument
 * @type {exports}
 */
var argument = require('../bin/argument');
describe('argument', function () {
  it('should return 8080', function () {
    assert.equal(8080, argument.port);
  });
});

/**
 * test ip
 * @type {exports}
 */
var ip = require('../bin/ip');
describe('ip', function () {
  it('should return *.*.*.*', function () {
    assert.equal(true, /\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/.test(ip.ipv4));
  });
});

/**
 * test serve
 * @type {serve|exports}
 */
var serve = require('../bin/serve');
describe('serve', function () {
  it('should be function', function () {
    assert.equal('function', typeof serve);
  })
});
