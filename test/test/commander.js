/**
 * @since 2016-08-20 15:03
 * @author vivaxy
 */

'use strict';

let program = require('commander');

function range (val) {
    return val.split('..').map(Number);
}

function list (val) {
    return val.split(',');
}

function collect (val, memo) {
    memo.push(val);
    return memo;
}

function increaseVerbosity (v, total) {
    return total + 1;
}

function formatWatch (value) {
    if (isNaN(Number(value))) {
        value = 0;
    } else if (value < 0) {
        value = 0;
    }
    return value;
}

program
    .version('0.0.1')
    .usage('[options] <file ...>')
    .option('-w, --watch [interval]', 'will watch files; once changed, reload pages', formatWatch)
    .option('-i, --integer <n>', 'An integer argument', parseInt)
    .option('-f, --float <n>', 'A float argument', parseFloat)
    .option('-r, --range <a>..<b>', 'A range', range)
    .option('-l, --list <items>', 'A list', list)
    .option('-o, --optional [value]', 'An optional value')
    .option('-c, --collect [value]', 'A repeatable value', collect, [])
    .option('-v, --verbose', 'A value that can be increased', increaseVerbosity, 0)
    .parse(process.argv);

// console.log(' int: %j', program.integer);
// console.log(' float: %j', program.float);
// console.log(' optional: %j', program.optional);
// program.range = program.range || [];
// console.log(' range: %j..%j', program.range[0], program.range[1]);
// console.log(' list: %j', program.list);
// console.log(' collect: %j', program.collect);
console.log(' verbosity: %j', program.verbose);
// console.log(' args: %j', program.args);
//
console.log(' watch', program.watch);

