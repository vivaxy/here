/**
 * @since 2016-03-02 18:00
 * @author vivaxy
 */

'use strict';

const path = require('path');
const log = require('log-util');
const koaRoute = require('koa-router')();

const server = require('../lib/server');

const app = server.server;

const absoluteWorkingDirectory = process.cwd();

module.exports = function* (next) {

    let file = path.join(absoluteWorkingDirectory, 'here.js');
    Reflect.deleteProperty(require.cache, file);
    let routeList = require(file);

    routeList.forEach((route) => {
        koaRoute[route.method](route.path, function* (_next) {
            this.body = Reflect.apply(route.data, this, arguments);
            yield _next;
        });
    });

    app.use(koaRoute.routes());
    app.use(koaRoute.allowedMethods());

    yield next;

};
