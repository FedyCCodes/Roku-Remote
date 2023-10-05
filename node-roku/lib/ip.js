var os = require('os');
var interfaces = os.networkInterfaces();
module.exports = function(){
    var Ip = null;
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                Ip = address.address;
            }
        }
    }
    return Ip;
}
