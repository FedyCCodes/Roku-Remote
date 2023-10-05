
/*
Code Recycled from: https://github.com/darkwing/roku-remote
*/

const request = require('request').defaults({ encoding: null });
const Roku = require('./node-roku');
const { xml2json } = require('./xml2json');
// gets all the main libs

/**
 * @class RokuRemote - the remote for the roku tv
 */
var RokuRemote = {};

/**
 * @static RokuRemote
 * @property {[string]} allFunctions - all the buttons for the buttons to click
 */
RokuRemote.allFunctions = [
  "Back",       "PowerOff",   "home",
  
                "Up",
  "Left",       "Select",     "Right",
                "Down",
                
  "Rev",        "Play",       "Fwd",
  "VolumeMute", "VolumeDown", "VolumeUp"
];

/**
 * @static RokuRemote
 * @property {Object<string:string>} functionToSvg - the conversion for the svg icons
 */
RokuRemote.functionToSvg = {
  "Back": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><title>ionicons-v5-c</title><polyline points="112 160 48 224 112 288" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/><path d="M64,224H358c58.76,0,106,49.33,106,108v20" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/></svg>`,
  "PowerOff": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><title>ionicons-v5-p</title><path d="M378,108a191.41,191.41,0,0,1,70,148c0,106-86,192-192,192S64,362,64,256a192,192,0,0,1,69-148" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/><line x1="256" y1="64" x2="256" y2="256" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/></svg>`,
  "home": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><title>ionicons-v5-i</title><path d="M80,212V448a16,16,0,0,0,16,16h96V328a24,24,0,0,1,24-24h80a24,24,0,0,1,24,24V464h96a16,16,0,0,0,16-16V212" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/><path d="M480,256,266.89,52c-5-5.28-16.69-5.34-21.78,0L32,256" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/><polyline points="400 179 400 64 352 64 352 133" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/></svg>`,
  "Up": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><title>ionicons-v5-a</title><polyline points="112 244 256 100 400 244" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"/><line x1="256" y1="120" x2="256" y2="412" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"/></svg>`,
  "Left": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><title>ionicons-v5-a</title><polyline points="244 400 100 256 244 112" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"/><line x1="120" y1="256" x2="412" y2="256" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"/></svg>`,
  "Select": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><title>ionicons-v5-e</title><path d="M448,256c0-106-86-192-192-192S64,150,64,256s86,192,192,192S448,362,448,256Z" style="fill:none;stroke-miterlimit:10;stroke-width:32px"/><polyline points="352 176 217.6 336 160 272" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/></svg>`,
  "Right": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><title>ionicons-v5-a</title><polyline points="268 112 412 256 268 400" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"/><line x1="392" y1="256" x2="100" y2="256" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"/></svg>`,
  "Down": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><title>ionicons-v5-a</title><polyline points="112 268 256 412 400 268" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"/><line x1="256" y1="392" x2="256" y2="100" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"/></svg>`,
  "Rev": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><title>ionicons-v5-c</title><path d="M30.71,229.47l188.87-113a30.54,30.54,0,0,1,31.09-.39,33.74,33.74,0,0,1,16.76,29.47V224.6L448.15,116.44a30.54,30.54,0,0,1,31.09-.39A33.74,33.74,0,0,1,496,145.52v221A33.73,33.73,0,0,1,479.24,396a30.54,30.54,0,0,1-31.09-.39L267.43,287.4v79.08A33.73,33.73,0,0,1,250.67,396a30.54,30.54,0,0,1-31.09-.39l-188.87-113a31.27,31.27,0,0,1,0-53Z"/></svg>`,
  "Play": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><title>ionicons-v5-c</title><rect x="176" y="96" width="16" height="320" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/><rect x="320" y="96" width="16" height="320" style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/></svg>`,
  "Fwd": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><title>ionicons-v5-c</title><path d="M481.29,229.47l-188.87-113a30.54,30.54,0,0,0-31.09-.39,33.74,33.74,0,0,0-16.76,29.47V224.6L63.85,116.44a30.54,30.54,0,0,0-31.09-.39A33.74,33.74,0,0,0,16,145.52v221A33.74,33.74,0,0,0,32.76,396a30.54,30.54,0,0,0,31.09-.39L244.57,287.4v79.08A33.74,33.74,0,0,0,261.33,396a30.54,30.54,0,0,0,31.09-.39l188.87-113a31.27,31.27,0,0,0,0-53Z"/></svg>`,
  "VolumeMute": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><title>ionicons-v5-g</title><line x1="416" y1="432" x2="64" y2="80" style="fill:none;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px"/><path d="M243.33,98.86a23.89,23.89,0,0,0-25.55,1.82l-.66.51L188.6,124.54a8,8,0,0,0-.59,11.85l54.33,54.33A8,8,0,0,0,256,185.06V120.57A24.51,24.51,0,0,0,243.33,98.86Z"/><path d="M251.33,335.29,96.69,180.69A16,16,0,0,0,85.38,176H56a24,24,0,0,0-24,24V312a24,24,0,0,0,24,24h69.76l92,75.31A23.9,23.9,0,0,0,243.63,413,24.51,24.51,0,0,0,256,391.45V346.59A16,16,0,0,0,251.33,335.29Z"/><path d="M352,256c0-24.56-5.81-47.87-17.75-71.27a16,16,0,1,0-28.5,14.55C315.34,218.06,320,236.62,320,256q0,4-.31,8.13a8,8,0,0,0,2.32,6.25l14.36,14.36a8,8,0,0,0,13.55-4.31A146,146,0,0,0,352,256Z"/><path d="M416,256c0-51.18-13.08-83.89-34.18-120.06a16,16,0,0,0-27.64,16.12C373.07,184.44,384,211.83,384,256c0,23.83-3.29,42.88-9.37,60.65a8,8,0,0,0,1.9,8.26L389,337.4a8,8,0,0,0,13.13-2.79C411,311.76,416,287.26,416,256Z"/><path d="M480,256c0-74.25-20.19-121.11-50.51-168.61a16,16,0,1,0-27,17.22C429.82,147.38,448,189.5,448,256c0,46.19-8.43,80.27-22.43,110.53a8,8,0,0,0,1.59,9l11.92,11.92A8,8,0,0,0,452,385.29C471.6,344.9,480,305,480,256Z"/></svg>`, 
  "VolumeDown": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><title>ionicons-v5-g</title><path d="M296,416.19a23.92,23.92,0,0,1-14.21-4.69l-.66-.51-91.46-75H120a24,24,0,0,1-24-24V200a24,24,0,0,1,24-24h69.65l91.46-75,.66-.51A24,24,0,0,1,320,119.83V392.17a24,24,0,0,1-24,24Z"/><path d="M384,336a16,16,0,0,1-14.29-23.18c9.49-18.9,14.3-38,14.3-56.82,0-19.36-4.66-37.92-14.25-56.73a16,16,0,0,1,28.5-14.54C410.2,208.16,416,231.47,416,256c0,23.83-6,47.78-17.7,71.18A16,16,0,0,1,384,336Z"/></svg>`, 
  "VolumeUp": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><title>ionicons-v5-g</title><path d="M264,416.19a23.92,23.92,0,0,1-14.21-4.69l-.66-.51-91.46-75H88a24,24,0,0,1-24-24V200a24,24,0,0,1,24-24h69.65l91.46-75,.66-.51A24,24,0,0,1,288,119.83V392.17a24,24,0,0,1-24,24Z"/><path d="M352,336a16,16,0,0,1-14.29-23.18c9.49-18.9,14.3-38,14.3-56.82,0-19.36-4.66-37.92-14.25-56.73a16,16,0,0,1,28.5-14.54C378.2,208.16,384,231.47,384,256c0,23.83-6,47.78-17.7,71.18A16,16,0,0,1,352,336Z"/><path d="M400,384a16,16,0,0,1-13.87-24C405,327.05,416,299.45,416,256c0-44.12-10.94-71.52-29.83-103.95A16,16,0,0,1,413.83,136C434.92,172.16,448,204.88,448,256c0,50.36-13.06,83.24-34.12,120A16,16,0,0,1,400,384Z"/></svg>`
};

/**
 * @static RokuRemote
 * @property {string} address - the roku tv remote address in the house
 */
RokuRemote.address = null;

/**
 * @static RokuRemote
 * @property {[string]} addresses - the roku tvs multiple IP addresses
 */
RokuRemote.addresses = [];

// Map to this URL: http://******:8060/keypress/{key}

/**
 * @static RokuRemote
 * @property {Object<string:string>} keyEndpoint - the key down to roku remote function
 */
RokuRemote.keyEndpoint = {
  // Arrow Keys
  arrowleft: 'Left',
  arrowright: 'Right',
  arrowup: 'Up',
  arrowdown: 'Down',

  // Standard Keys
  space: 'Play',
  backspace: 'Back',
  "enter": 'Select',

  // Sequences (shift key)
  H: 'home',
  R: 'Rev',
  F: 'Fwd',
  O: 'PowerOff'
  
};


/**
 * @static RokuRemote
 * @property {Object<string:String>} addressKey - a hash table that stores the ip addresses
 */
RokuRemote.addressKey = {};


/**
 * @static RokuRemote
 * @method xmlToObject - the function convert xml text to json recycled from the roku-remote project
 */
RokuRemote.xmlToObject = (xml) => {
  var parser = new DOMParser();
  return JSON.parse(xml2json(parser.parseFromString(xml, "text/xml")));
};


/**
 * @static RokuRemote
 * @method runButton - a function to run a remote button
 * @param {String} key - which key the button wants to click on
 */
RokuRemote.runButton = function(key) {
  
  if(RokuRemote.address === null) {
    // checks if it's undefined
    
    return;
    // kills the function
  }
  
  var endpoint = RokuRemote.keyEndpoint[key] || key;
  // gets the key in either text form or keycode form
  
  if (RokuRemote.allFunctions.includes(endpoint)) request.post(RokuRemote.address + '/keypress/' + endpoint);
  // Send the command if it was valid
  
};


/**
 * @static RokuRemote
 * @method setupApps - creates the applications for the TV based on the selection
 */
RokuRemote.setupApps = function() {
  
  Roku.getApps(RokuRemote.address, (err, appsDetail)=>{
    // gets the apps
    
    appsDetail = RokuRemote.xmlToObject(appsDetail);
    // redefines the app details
    
    document.getElementById("roku-title-app").innerText = 'Apps: Connected';
    // changes the text
    
    for (var app of appsDetail.apps) {
      // loops through each app
      
      request(RokuRemote.address + "/query/icon/" + app["app@id"], null, (error, response, body)=>{
        // gets the app icon
        
        if (!error && response.statusCode == 200) {
          // checks that the data is valid
          
          var imageIconData = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(response.body).toString('base64');
          // gets the base64 of the image
          
          var container = document.getElementById("roku-apps");
          // gets the container
          
          var appCard = document.createElement("div");
          // creates the div
          
          appCard.setAttribute("class", "roku-button-app-card");
          // sets the class 
          
          appCard.style.backgroundImage = `url('${imageIconData}')`;
          // sets the icon
          
          appCard.setAttribute("app-id", response.req.path.replace("/query/icon/", ""));
          // sets the app id
          
          appCard.onclick = function(e){
            // sets the funciton 
            
            request.post(RokuRemote.address + "/launch/" + e.target.getAttribute("app-id"));
            // sends the launch app
            
          };
          
          container.appendChild(appCard);
          // adds the app to the html
          
        }
        
      });
      
    }
    
  });
  
};


Roku.find((err, devices) => {
  // Finds the first roku remote
  if(err) {
    // if there is an error
    
    document.getElementById("roku-title-main").innerText = 'Error When Loading.';
    // changes the text
    
    console.log('`roku.find` error: ', err);
    
    return;
    // cuts the function
    
  }

  if(!devices.length) {
    // if there is no device found
    
    document.getElementById("roku-title-main").innerText = 'No Roku devices found.';
    // changes the text
    
    console.log('No Roku devices found.');
    
    return;
    // cuts the function
  } 
  
  var prevAddress = RokuRemote.address;
  // gets the previous address
  
  RokuRemote.address = devices[0];
  // gets the address
  
  RokuRemote.addresses = devices;
  // stores all the devices
  
  if (RokuRemote.address) {
    // checks that an address is found
    
    if (prevAddress != RokuRemote.address) {
      // if the previous address is different from the stored address it will set it up
      
      addEventListener("keydown", function(e){
        // key down callback
        
        RokuRemote.runButton((e.key != " " ? e.key : "space").toLowerCase());
        // runs the key button
        
      });
      
      for (var index in RokuRemote.allFunctions) {
        // gets a string for all the roku button
        
        var rokuFunction = RokuRemote.allFunctions[index];
        // gets the roku button
        
        var rokuButton = document.getElementsByTagName("button")[index];
        // gets the button
        
        rokuButton.setAttribute("roku-function", rokuFunction);
        // stores the roku function
        
        rokuButton.innerHTML = RokuRemote.functionToSvg[rokuFunction];
        // sets the icon
        
        rokuButton.onclick = function(e){
          // defines the onclick
          console.log(e);
          
          for (var i = 0; i < e.path.length; i++) {
            // loops through each element
            
            var rokuFunctionStr = e.path[i].getAttribute("roku-function");
            // stores the roku function
            
            if (rokuFunctionStr != null) {
              // checks if there is a function for the button
              
              RokuRemote.runButton(rokuFunctionStr);
              // runs the button for the command
              
              return;
              // rcuts the function
            }
            
          }
          
        };
        
      }
      
      document.getElementById("roku-search-button").innerHTML = `<svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><title>ionicons-v5-f</title><path d="M456.69,421.39,362.6,327.3a173.81,173.81,0,0,0,34.84-104.58C397.44,126.38,319.06,48,222.72,48S48,126.38,48,222.72s78.38,174.72,174.72,174.72A173.81,173.81,0,0,0,327.3,362.6l94.09,94.09a25,25,0,0,0,35.3-35.3ZM97.92,222.72a124.8,124.8,0,1,1,124.8,124.8A124.95,124.95,0,0,1,97.92,222.72Z"/></svg>`;
      // sets the icon for the search button
      
      document.getElementById("roku-search-button").onclick = function(){
        // sets the callback for the roku search button
        
        var value = document.getElementById("roku-search-text");
        // gets the text value
        
        value = value.split(" ").join("%20");
        // replaces all the spaces
        
        request.post(RokuRemote.address + '/search/browse?keyword=' + value);
        // sends the search request
        
      };
      
      RokuRemote.setupApps();
      // sets up the apps
      
    }
    var addresses = RokuRemote.addresses.slice();
    // gets a copy of the addresses
    
    for (var address of addresses) {
      // loops through all the addresses in the system
      
      Roku.getDevice(address, (err, deviceDetail) => {
        // gets the device details
        
        var ipAddress = addresses.shift();
        // ip address
        
        console.log(deviceDetail);
        
        deviceDetail = RokuRemote.xmlToObject(deviceDetail);
        // stores the device details
        
        RokuRemote.addressKey[ipAddress] = deviceDetail.root.device.friendlyName;
        // stores the name on the addresses
        
        console.log('Connected to Device: ', RokuRemote.addressKey[ipAddress], ' (', ipAddress, ')');
        // console.log('Press keys to navigate the Roku and select content!');
        
        document.getElementById("roku-title-main").innerHTML = "Main: " + `<select id="roku-button-select-tv" style="width: 200px;margin: 0 auto;padding: 7px 17px;" class="roku-button-secondary">${
          // adds in all the addresses
          
          RokuRemote.addresses.map(address=>
            `<option value="${address}">${RokuRemote.addressKey[address]}</option>`
          ).join("")
          // adds the addresses
          
        }</select>`;
        
        document.getElementById("roku-button-select-tv").onchange = function(){
          // gets the onchange for tv
          
          var ipAddress = document.getElementById("roku-button-select-tv").value;
          // the ip address changed
          
          
          RokuRemote.address = ipAddress;
          // sets the ip address
          
          
        };
        
      });
      
    }
    
    // 
    // sets the name
    
    
  }
});


