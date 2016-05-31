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
var csv = require('csv-array');

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// Parse out Cloudant settings

if (!appEnv.isLocal) {
   cloudant = appEnv.getServiceCreds(/Cloudant/);
}

var nano = require('nano')(cloudant.url);
var assassin = nano.db.use('assassin');

// Set path to JavaScript files
app.set('js', __dirname + '/js');

// Set path to image files
app.set('images', __dirname + '/images');

// Set path to Jade template directory
app.set('views', __dirname + '/views');

// Set path to Jade template directory
app.set('data', __dirname + '/data');

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// Bind the root '/' URL to the login page
app.get('/', function(req, res){
  res.render('welcome.jade', {title: "LET'S PLAY ASSASSINS"});
});

// Bind the root '/' URL to the login page
app.get('/login', function(req, res){
  res.render('login.jade', {title: "LET'S PLAY ASSASSINS"});
});

app.get('/signup', function(req, res){
  res.render('signup.jade', {title: "Sign Up!"});
});

app.get('/create', function(req, res){
  res.render('create.jade', {title: "Make a Game!"});
});

app.get('/playerlist', function(request, response) {
   /* var players = [];
        players.push({"name": "Hanzhi Zou", "role": "God", "id": "gangrene"});		
        players.push({"name": "Pineapple Joe", "role": "Player", "id": "iluvfruit98095843141234234"});		      
      response.send(JSON.stringify(players));
      */
    assassin.view('players', 'players-index', function(err, body) {
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
    assassin.view('teams', 'teams-index', function(err, body) {
    	if(!err) {
    		var teams = [];
    		body.rows.forEach(function(doc) {
    			teams.push(doc.value);
    		});
    		response.send(JSON.stringify(teams));
    	}
    });
});

app.get('/targetlist', function(request,response) {
    var targets = []; 
    targets.push({"name": "Hanzhi Zou", "target": "Sonya", "time": "2 hours"});
    targets.push({"name": "Jon Bass", "target": "Gangrene", "time": "2 minutes"});
    response.send(JSON.stringify(targets));
});


//app.get('/initdata', function(request,response) {
    /* stub for really dropping and recreating the database. for now we'll just load
       nano.db.destroy('assassin', function(err) {
       if (!err) {
	   nano.db.create('assassin', function(err) {
		   if (!err) {
		       assassin = nano.db.use('assassin'); }})}})
    */
/*
       csv.parseCSV("public/data/players.csv", function(data){
  	  data.forEach(function(player) {
                  var id = player.first.substr(0,2).concat(player.last).toLowerCase();
	          assassin.insert(player, id, function(err, body, header) {
			  if (err) 
			      { return console.log('[assassin.insert] ', err.message) };
			  console.log('You have inserted the player.');
                          console.log(body);
		      })
		      })}, true);

       csv.parseCSV("public/data/teams.csv", function(data){
  	  data.forEach(function(team) {
                  assassin.insert(team, team.name, function(err, body, header) {
			  if (err) 
			      { return console.log('[assassin.insert] ', err.message) };
			  console.log('You have inserted the team.');
                          console.log(body);
		      })
	      })}, true);
       response.send('data loading');
    });
*/      

// start server on the specified port and binding host
var server = app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
	console.log("server starting on port %d on host %s url %s ", server.address().port, appEnv.bind, appEnv.url);
});
