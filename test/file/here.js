/**
 * @since 15-08-20 15:08
 * @author vivaxy
 */
'use strict';
module.exports = function (req, res) {
    console.log(req);
    res.end('test');
    return false;
};
