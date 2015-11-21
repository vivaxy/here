/**
 * @since 2015-09-23 16:38
 * @author vivaxy
 */
'use strict';
const assert = require('assert');
const childProcess = require('child_process');

const packageJson = require('../package.json');

const spawn = childProcess.spawn;

const NODE_COMMAND = 'node';
const HERE_COMMAND = './debug.js';

describe('test terminal command `here`', () => {
    let here;
    afterEach(() => {
        here.kill();
    });
    it('`here` should output `[??:??:??.???] server : listen http://*.*.*.*:*/`', done => {
        here = spawn(NODE_COMMAND, [HERE_COMMAND]);
        here.stdout.on('data', data => {
            data = data.toString();
            assert.equal(true, /^\[\d{2}:\d{2}:\d{2}\.\d{3}\] server : listen http:\/\/\d+\.\d+\.\d+\.\d+:\d+\/\n$/.test(data));
            here.kill();
            done();
        });
    });
    it('`here -v` should output `version`', done => {
        here = spawn(NODE_COMMAND, [HERE_COMMAND, '-v']);
        here.stdout.on('data', data => {
            data = data.toString();
            assert.equal(packageJson.version + '\n', data);
            done();
        });
    });
    it('`here --version` should output `version`', done => {
        here = spawn(NODE_COMMAND, [HERE_COMMAND, '--version']);
        here.stdout.on('data', data => {
            data = data.toString();
            assert.equal(packageJson.version + '\n', data);
            done();
        });
    });
    it('`here -h` should output help', done => {
        here = spawn(NODE_COMMAND, [HERE_COMMAND, '-h']);
        here.stdout.on('data', data => {
            data = data.toString();
            assert.equal(true, !!~data.indexOf('Usage: index [options]') && !!~data.indexOf('Options:'));
            done();
        });
    });
    it('`here -w` should output `[??:??:??.???] server : listen http://*.*.*.*:*/` and `[??:??:??.???] watcher: pages will be reloaded in 0 seconds after final change was taken`', done => {
        here = spawn(NODE_COMMAND, [HERE_COMMAND, '-w']);
        let stdoutCount = 0;
        here.stdout.on('data', data => {
            stdoutCount++;
            data = data.toString();
            switch (stdoutCount) {
                case 1:
                    assert.equal(true, /^\[\d{2}:\d{2}:\d{2}\.\d{3}\] server : listen http:\/\/\d+\.\d+\.\d+\.\d+:\d+\/\n$/.test(data));
                    break;
                case 2:
                    assert.equal(true, /^\[\d{2}:\d{2}:\d{2}\.\d{3}\] watcher: pages will be reloaded in 0 seconds after final change was taken\n$/.test(data));
                    here.kill();
                    done();
                    break;
                default:
                    assert.fail(stdoutCount, 2);
                    done();
                    break;
            }
        });
    });
    it('`here --watch 3` should output `[??:??:??.???] server : listen http://*.*.*.*:*/` and `[??:??:??.???] watcher: pages will be reloaded in 3 seconds after final change was taken`', done => {
        here = spawn(NODE_COMMAND, [HERE_COMMAND, '--watch', '3']);
        let stdOutCount = 0;
        here.stdout.on('data', data => {
            stdOutCount++;
            data = data.toString();
            switch (stdOutCount) {
                case 1:
                    assert.equal(true, /^\[\d{2}:\d{2}:\d{2}\.\d{3}\] server : listen http:\/\/\d+\.\d+\.\d+\.\d+:\d+\/\n$/.test(data));
                    break;
                case 2:
                    assert.equal(true, /^\[\d{2}:\d{2}:\d{2}\.\d{3}\] watcher: pages will be reloaded in 3 seconds after final change was taken\n$/.test(data));
                    here.kill();
                    done();
                    break;
                default:
                    assert.fail(stdOutCount, 2);
                    done();
                    break;
            }
        });
    });
});
