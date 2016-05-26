/*eslint-env node, express*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

var express = require('express');
var app = express();

var cloudant = {
url : "https://edbede34-5fac-45c8-a2a9-a066bb3d6000-bluemix:6d0fd78d822e7fa111e98b26c317ebddb5464fecf17d2731d7a0bb50ddd01c7b@edbede34-5fac-45c8-a2a9-a066bb3d6000-bluemix.cloudant.com"	 		 
};

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// Parse out Cloudant settings

if (!appEnv.isLocal) {
   cloudant = appEnv.getServiceCreds(/Cloudant/);
}

var nano = require('nano')(cloudant.url);
var db = nano.db.use('assassin');

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

// Set path to JavaScript files
app.set('js', __dirname + '/js');

// Set path to image files
app.set('images', __dirname + '/images');

//////////////////////////////////////////////////////////////

app.get('/playerlist', function(request, response) {
    var players = [];
        players.push({"first": "Hanzhi", "last": "Zou", "role": "God", "id": "gangrene"});		
        players.push({"first": "Pineapple", "last": "Joe", "role": "Player", "id": "iluvfruit98095843141234234"});		      
      response.send(JSON.stringify(players));
}); 


