var port = 8060;
module.exports = function(data){
    var Ip = data.ip;
    var device = data.device;
    var splt = Ip.split('.');
    var ip = "";
    for (var i = 0; i < splt.length; i++) {
        var key = splt[i];
        if(i == 0){
            ip += key;
        }else{
            key = ((splt.length-1)== i)? device: key;
            ip +='.' + key;
        }
    }
    return 'http://'+ ip +':'+port;
};
