/**
 * @since 150201 10:58
 * @author vivaxy
 */

var os = require('os'),
    /**
     * Get ip(v4) address
     * @return {String} the ipv4 address or 'localhost'
     */
    getIPAddress = function () {
        var ifaces = os.networkInterfaces(),
            ip = '',
            dev;
        for (dev in ifaces) {
            if (ifaces.hasOwnProperty(dev)) {
                ifaces[dev].forEach(function (details) {
                    if (ip === '' && details.family === 'IPv4' && !details.internal) {
                        ip = details.address;
                        return true;
                    }
                });
            }
        }
        return ip || "127.0.0.1";
    };

module.exports = {
    ipv4: getIPAddress()
};
