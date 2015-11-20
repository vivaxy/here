/**
 * @since 2015-09-23 16:38
 * @author vivaxy
 */
'use strict';
var assert = require('assert');
var spawn = require('child_process').spawn;
var packageJson = require('../package.json');

describe('test terminal command `here`', function () {
    var here;
    afterEach(function () {
        here.kill();
    });
    it('`here` should output `[??:??:??.???] server : listen http://*.*.*.*:*/`', function (done) {
        here = spawn('node', ['./index.js']);
        here.stdout.on('data', function (data) {
            data = data.toString();
            assert.equal(true, /^\[\d{2}:\d{2}:\d{2}\.\d{3}\] server : listen http:\/\/\d+\.\d+\.\d+\.\d+:\d+\/\n$/.test(data));
            here.kill();
            done();
        });
    });
    it('`here -v` should output `version`', function (done) {
        here = spawn('node', ['./index.js', '-v']);
        here.stdout.on('data', function (data) {
            data = data.toString();
            assert.equal(packageJson.version + '\n', data);
            done();
        });
    });
    it('`here --version` should output `version`', function (done) {
        here = spawn('node', ['./index.js', '--version']);
        here.stdout.on('data', function (data) {
            data = data.toString();
            assert.equal(packageJson.version + '\n', data);
            done();
        });
    });
    it('`here -h` should output help', function (done) {
        here = spawn('node', ['./index.js', '-h']);
        here.stdout.on('data', function (data) {
            data = data.toString();
            assert.equal(true, !!~data.indexOf('Usage: index [options]') && !!~data.indexOf('Options:'));
            done();
        });
    });
});
