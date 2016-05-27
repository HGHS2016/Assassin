/*eslint-env node, express*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

var express = require('express');
var app = express();
//var http = require('http')

//var host = "localhost"
//var port = 3030;

var cloudant = {
  url:"https://edbede34-5fac-45c8-a2a9-a066bb3d6000-bluemix:6d0fd78d822e7fa111e98b26c317ebddb5464fecf17d2731d7a0bb50ddd01c7b@edbede34-5fac-45c8-a2a9-a066bb3d6000-bluemix.cloudant.com"	 		 
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

// Set path to JavaScript files
app.set('js', __dirname + '/js');

// Set path to image files
app.set('images', __dirname + '/images');

// Set path to Jade template directory
app.set('views', __dirname + '/views');

// Bind the root '/' URL to the login page
app.get('/', function(req, res){
  res.render('gods.jade', {title: "LET'S PLAY ASSASSINS"});
});

// Bind the root '/' URL to the login page
app.get('/login', function(req, res){
  res.render('login.jade', {title: "LET'S PLAY ASSASSINS"});
});

app.get('/playerlist', function(request, response) {
    db.view('players', 'players-index', function(err, body) {
    	if(!err) {
    		var players = [];
    		body.rows.forEach(function(doc) {
    			players.push(doc.value);
    		});
    		response.send(JSON.stringify(players));
    	}
    });
}); 

app.get('/teamlist', function(request, response) {
    db.view('teams', 'teams-index', function(err, body) {
    	if(!err) {
    		var teams = [];
    		body.rows.forEach(function(doc) {
    			teams.push(doc.value);
    		});
    		response.send(JSON.stringify(teams));
    	}
    });
    
/* app.get('/teamlist', function(request,response) {
    var teams = []; 
    teams.push({"teamName": "t1", "player1": "Hanzhi Zou", "player2": "Gangrene", "target": "t2"});
    teams.push({"teamName": "t2", "player1": "Rebecca Dummit", "player2": "Noah Kessler", "target": "t1"});
    response.send(JSON.stringify(teams));
}); */

app.get('/targetlist', function(request,response) {
    var targets = []; 
    targets.push({"first": "Hanzhi", "last": "Zou", "target": "Sonya", "time": "2 hours"});
    targets.push({"first": "Jon", "last": "Bass", "target": "Gangrene", "time": "2 minutes"});
    response.send(JSON.stringify(targets));
});

// start server on the specified port and binding host
var server = app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
	console.log("server starting on port %d on host %s url %s ", server.address().port, appEnv.bind, appEnv.url);
});

process.on('exit', function() {
	console.log('Server is shutting down!');
    });
