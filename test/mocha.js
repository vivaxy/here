/**
 * @since 2015-09-23 16:38
 * @author vivaxy
 */
'use strict';
var assert = require('assert');
var spawn = require('child_process').spawn;
var packageJson = require('../package.json');

describe('test terminal command `here`', function () {
    var index;
    afterEach(function () {
        index.kill();
    });
    it('`here` should output `[??:??:??.???] server : listen http://*.*.*.*:*/`', function (done) {
        index = spawn('./index.js');
        index.stdout.on('data', function (data) {
            data = data.toString();
            assert.equal(true, /^\[\d{2}:\d{2}:\d{2}\.\d{3}\] server : listen http:\/\/\d+\.\d+\.\d+\.\d+:\d+\/\n$/.test(data));
            index.kill();
            done();
        });
    });
    it('`here -v` should output `version`', function (done) {
        index = spawn('./index.js', ['-v']);
        index.stdout.on('data', function (data) {
            data = data.toString();
            assert.equal(packageJson.version + '\n', data);
            done();
        });
    });
    it('`here --version` should output `version`', function (done) {
        index = spawn('./index.js', ['--version']);
        index.stdout.on('data', function (data) {
            data = data.toString();
            assert.equal(packageJson.version + '\n', data);
            done();
        });
    });
    it('`here -w` should output `[??:??:??.???] server : listen http://*.*.*.*:*/` and `[??:??:??.???] watcher : listen http://*.*.*.*:*/`', function (done) {
        index = spawn('./index.js', ['-w']);
        var stdoutCount = 0;
        index.stdout.on('data', function (data) {
            stdoutCount++;
            data = data.toString();
            switch (stdoutCount) {
                case 1:
                    assert.equal(true, /^\[\d{2}:\d{2}:\d{2}\.\d{3}\] watcher: listen http:\/\/\d+\.\d+\.\d+\.\d+:\d+\/\n$/.test(data));
                    break;
                case 2:
                    assert.equal(true, /^\[\d{2}:\d{2}:\d{2}\.\d{3}\] server : listen http:\/\/\d+\.\d+\.\d+\.\d+:\d+\/\n$/.test(data));
                    index.kill();
                    done();
                    break;
                default:
                    assert.fail(stdoutCount, 2);
                    done();
                    break;
            }
        });
    });
    it('`here -h` should output help', function (done) {
        index = spawn('./index.js', ['-h']);
        index.stdout.on('data', function (data) {
            data = data.toString();
            assert.equal(true, !!~data.indexOf('Usage: index [options]') && !!~data.indexOf('Options:'));
            done();
        });
    });
});
