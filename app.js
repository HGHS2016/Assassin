/*eslint-env node, express*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

var express = require('express');
var app = express();
var http = require('http');

var host = "localhost";
var port = 3030;
var cloudant = {
		 		 url : "https://edbede34-5fac-45c8-a2a9-a066bb3d6000-bluemix:6d0fd78d822e7fa111e98b26c317ebddb5464fecf17d2731d7a0bb50ddd01c7b@edbede34-5fac-45c8-a2a9-a066bb3d6000-bluemix.cloudant.com"	 		 
};
if (process.env.hasOwnProperty("VCAP_SERVICES")) {
  // Running on Bluemix. Parse out the port and host that we've been assigned.
  var env = JSON.parse(process.env.VCAP_SERVICES);
  var host = process.env.VCAP_APP_HOST;
  var port = process.env.VCAP_APP_PORT;

  // Also parse out Cloudant settings.
  cloudant = env['cloudantNoSQLDB'][0].credentials;  
}
var nano = require('nano')(cloudant.url);
var db = nano.db.use('assassin');

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
