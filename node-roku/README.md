## node-roku find roku devices (by Garciacom)
Find any roku device connected to your internet network, easy and fast, just scan and save to json file so you don't need to scan everytime, then you can controll anything from POST enjoy and support this proyect.

Web: **[garciacom.net](http://garciacom.net)**  
Twitter: **[Garciacom_](http://twitter.com/garciacom_)**  
Facebook: **[Garciacom](http://facebook.com/garciacom)**
___
Functions:
```js
// example
var Roku = require('node-roku');
Roku.find(function(err,roku){
    if(!err){
    	var getFirstDevice = roku[0];
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
    }
})

```
Installation:
```sh
$ npm install node-roku --save
```
After you find you roku ip you can send a POST request to any of this to do magic with you roku.
```sh
http://192.168.1.*:8060/keypress/home
http://192.168.1.*:8060/keypress/Rev
http://192.168.1.*:8060/keypress/Fwd
http://192.168.1.*:8060/keypress/Play
http://192.168.1.*:8060/keypress/Select
http://192.168.1.*:8060/keypress/Left
http://192.168.1.*:8060/keypress/Right
http://192.168.1.*:8060/keypress/Down
http://192.168.1.*:8060/keypress/Up
http://192.168.1.*:8060/keypress/Back
http://192.168.1.*:8060/keypress/InstantReplay
http://192.168.1.*:8060/keypress/InfoBackspace
http://192.168.1.*:8060/keypress/Search
http://192.168.1.*:8060/keypress/Enter
http://192.168.1.*:8060/keypress/Lit_*
```
Get the list of apps in you roku the following url will return xml data with all apps each app has id this is very important.
```sh
http://192.168.1.*:8060/query/apps
```
Get app icon 12 is the app id
```sh
http://192.168.1.*:8060/launch/12
```
Launch Roku app remember 12 is the id
```sh
http://192.168.1.*:8060/launch/12
```
