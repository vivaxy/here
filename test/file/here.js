/**
 * @since 15-08-20 15:08
 * @author vivaxy
 */
'use strict';

module.exports = [
    function* (next) {
        console.log(this.request.path);
        if (this.request.path === '/test') {
            this.body = 'test';
            return;
        }
        yield next;
    }
];
