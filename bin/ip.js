/**
 * @since 150201 10:58
 * @author vivaxy
 */

var os = require('os');

/**
 * Get ip(v4) address
 * @return {String} the ipv4 address or 'localhost'
 */
var getIPAddress = function () {
    var ifaces = os.networkInterfaces();
    var ip = '';
    for (var dev in ifaces) {
        ifaces[dev].forEach(function (details) {
            if (ip === '' && details.family === 'IPv4' && !details.internal) {
                ip = details.address;
                return true;
            }
        });
    }
    return ip || "127.0.0.1";
};


module.exports = exports = {
    ipv4: getIPAddress()
};