var request = require('request');
var localIp = require('./lib/ip');
var lookup = require('./lib/lookup');
var intrvl = null;
module.exports = {
    getApps:function(url,callback){
        url = url + '/query/apps';
        request(url, function (error, response, xml) {
            if (!error && response.statusCode == 200) {
                callback(null,xml)
            }
        });
    },
    getDevice:function(url,callback){
        request(url, function (error, response, xml) {
            if (!error && response.statusCode == 200) {
                callback(null,xml)
            }
        });
    },
    findIp:function(callback){
        /* First step find my roku address */
        
        console.log("External Node Roku");
        
        var ip = localIp();
        var roku = [];
        var device = 0;
        var limit  = 200;
        var intrvl = setInterval(function(){
            device++;
            if(device <= limit){
                var url = lookup({ip:ip,device:device});
                console.log(ip, url, device);
                request(url, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        roku.push(url);
                        callback(null,roku);
                    }
                });
            }else{
                callback(null,roku);
                clearInterval(intrvl);
            }
        },20);
    },
    find:function(callback){
        this.findIp(callback);
    }
}
