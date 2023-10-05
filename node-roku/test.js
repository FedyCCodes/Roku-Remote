var Roku = require('./index.js');
//Roku.find(function(err,roku){
    //if(!err){
    	//var getFirstDevice = roku[0];
        getFirstDevice = 'http://192.168.1.4:8060';
        Roku.getDevice(getFirstDevice,function(err,device){
            if(!err){
                console.log(device);
            }
        });
        Roku.getApps(getFirstDevice,function(err,apps){
            if(!err){
                console.log(apps);
            }
        });
    //}
///});
