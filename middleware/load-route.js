/**
 * @since 2016-03-02 18:00
 * @author vivaxy
 */

'use strict';

const path = require('path');
const koaRoute = require('koa-router')();

const configKey = require('../constant/config');

const config = require('../lib/config');

const loadRoutes = () => {
    const directory = config.get(configKey.DIRECTORY);
    const file = path.join(directory, 'here.js');
    const routeList = require(file);
    routeList.forEach((route) => {
        koaRoute[route.method](route.path, require('./log'), function* () {
            this.body = route.data.apply(this, arguments);
        });
    });
};

module.exports = (server) => {
    loadRoutes();

    server.use(koaRoute.routes());
    server.use(koaRoute.allowedMethods());

    return function* (next) {
        yield next;
    };
};
